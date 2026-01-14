import { useEffect, useState } from "react";
import api from "../services/api";
import Container from "../components/Container";
import AdminHeader from "../components/AdminHeader";
import Footer from "../components/Footer";

import {
  successAlert,
  errorAlert,
  confirmAlert,
} from "../services/alerts";

export default function AdminPanel() {
  const [subs, setSubs] = useState([]);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusDrafts, setStatusDrafts] = useState({});
  const [statusObservations, setStatusObservations] = useState({});

  useEffect(() => {
    let active = true;

    const fetchSubmissions = async () => {
      try {
        const res = await api.get("/admin/submissions");
        if (active) setSubs(res.data);
      } catch {
        if (active) errorAlert("Error", "Error cargando solicitudes");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchSubmissions();
    return () => {
      active = false;
    };
  }, []);

  const uploadAuthorizedUsers = async () => {
    if (!file) {
      errorAlert(
        "Archivo requerido",
        "Selecciona un archivo CSV o Excel"
      );
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post(
        "/admin/authorized-users/upload",
        formData
      );

      setMessage({
        procesados: res.data.registros_procesados,
        insertados: res.data.registros_insertados,
        omitidos: res.data.registros_omitidos,
      });

      successAlert("Éxito", "Base de usuarios actualizada");
      setFile(null);
    } catch {
      errorAlert("Error", "Error al subir el archivo");
    }
  };

  const downloadPDF = async (id, fullName) => {
    try {
      const res = await api.get(
        `/admin/download/${id}/pdf`,
        { responseType: "blob" }
      );

      const blob = new Blob([res.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fullName}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      errorAlert("Error", "No se pudo descargar el PDF");
    }
  };

  const deleteSubmission = async (id) => {
    const confirmed = await confirmAlert(
      "Eliminar solicitud",
      "¿Estás seguro? El usuario podrá enviar nuevamente."
    );

    if (!confirmed) return;

    try {
      await api.delete(`/admin/submissions/${id}`);
      setSubs(prev => prev.filter(s => s.id !== id));
      successAlert(
        "Eliminada",
        "Solicitud eliminada correctamente"
      );
    } catch {
      errorAlert("Error", "No se pudo eliminar la solicitud");
    }
  };

  return (
    <Container>
      <AdminHeader />

      <h2>Panel Administrativo</h2>

      <h3>Actualizar base de usuarios autorizados</h3>

      <input
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={e => setFile(e.target.files[0])}
      />

      <button onClick={uploadAuthorizedUsers}>
        Subir archivo
      </button>

      {message && (
        <div style={{ marginTop: "12px" }}>
          <p><strong>Carga completada</strong></p>
          <p>Registros procesados: {message.procesados}</p>
          <p>Registros insertados: {message.insertados}</p>
          <p>Registros omitidos: {message.omitidos}</p>
        </div>
      )}

      <hr />

      <h3>Solicitudes recibidas</h3>

      {loading && <p>Cargando solicitudes...</p>}
      {!loading && subs.length === 0 && (
        <p>No hay solicitudes registradas.</p>
      )}

      {subs.map(s => (
        <div
          key={s.id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "6px",
          }}
        >
          <strong>{s.fullName}</strong><br />
          <small>{s.email}</small><br />
          <p><strong>Estado actual:</strong> {s.status}</p>

          <select
            value={statusDrafts[s.id] ?? s.status}
            onChange={(e) =>
              setStatusDrafts(prev => ({
                ...prev,
                [s.id]: e.target.value,
              }))
            }
          >
            <option value="RECIBIDA">RECIBIDA</option>
            <option value="EN_REVISION">EN REVISIÓN</option>
            <option value="FALTA_INFORMACION">FALTA INFORMACIÓN</option>
            <option value="APROBADA">APROBADA</option>
            <option value="RECHAZADA">RECHAZADA</option>
          </select>

          {statusDrafts[s.id] === "FALTA_INFORMACION" && (
            <textarea
              placeholder="Describe qué información o documento falta"
              value={statusObservations[s.id] || ""}
              onChange={(e) =>
                setStatusObservations(prev => ({
                ...prev,
                [s.id]: e.target.value,
              }))
            }
            style={{ display: "block", marginTop: "8px", width: "100%" }}
          />
        )}

          <button
            style={{ marginLeft: "8px" }}
            onClick={async () => {
              try {
                await api.put(`/admin/submissions/${s.id}/status`, {
                  status: statusDrafts[s.id] ?? s.status,
                  observation: statusObservations[s.id],
                });

                setSubs(prev =>
                  prev.map(item =>
                    item.id === s.id
                      ? { ...item, status: statusDrafts[s.id], adminObservation: statusObservations[s.id], }
                      : item
                  )
                );

                successAlert("Estado actualizado", "El estado fue actualizado correctamente");
              } catch {
                errorAlert("Error", "No se pudo actualizar el estado");
              }
            }}

          >
            Actualizar estado
          </button>
          
          <button
            style={{ marginRight: "8px" }}
            onClick={() => downloadPDF(s.id, s.fullName)}
          >
            Descargar PDF
          </button>

          <button
            style={{
              backgroundColor: "#C62828",
              color: "white",
            }}
            onClick={() => deleteSubmission(s.id)}
          >
            Eliminar solicitud
          </button>
        </div>
      ))}
      <Footer />
    </Container>
  );
}
