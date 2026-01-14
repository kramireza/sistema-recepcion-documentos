import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import Container from "../components/Container";
import { successAlert, errorAlert } from "../services/alerts";
import Footer from "../components/Footer";

export default function FormPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state;

  const resubmit = state?.resubmit;
  const submissionId = state?.submissionId;
  const email = state?.email;
  const role = state?.role;

  const notAuthorized = !email || !role;

  const [data, setData] = useState({
    fullName: "",
    accountNumber: "",
  });

  const [files, setFiles] = useState({
    photo: null,
    dni: [],
    academic: null,
    form03: null,
  });

  const [existingFiles, setExistingFiles] = useState({
    photo: false,
    dni: false,
    academic: false,
    form03: false,
    adminObservation: null,
  });

  // 🔁 Cargar datos si es corrección
  useEffect(() => {
    if (!resubmit || !submissionId) return;

    api
      .get(`/submission/edit/${submissionId}`)
      .then(res => {
        setData({
          fullName: res.data.fullName,
          accountNumber: res.data.accountNumber,
        });

        setExistingFiles({
          photo: !!res.data.photoPath,
          dni: !!res.data.dniFrontPath && !!res.data.dniBackPath,
          academic: !!res.data.academicRecordPath,
          form03: !!res.data.form03Path,
          adminObservation: res.data.adminObservation,
        });
      })
      .catch(() => {
        errorAlert(
          "Error",
          "No se pudo cargar la información para corrección"
        );
        navigate("/", { replace: true });
      });
  }, [resubmit, submissionId, navigate]);

  if (notAuthorized) {
    return <Navigate to="/" replace />;
  }

  const submit = async () => {
    if (!data.fullName || !data.accountNumber) {
      errorAlert(
        "Formulario incompleto",
        "Completa todos los datos personales"
      );
      return;
    }

    // 🔒 Validación de archivos
    if (!resubmit) {
      if (
        !files.photo ||
        files.dni.length < 2 ||
        !files.academic ||
        !files.form03
      ) {
        errorAlert(
          "Documentos faltantes",
          "Debes subir todos los documentos requeridos"
        );
        return;
      }
    }

    try {
      const formData = new FormData();

      formData.append("fullName", data.fullName);
      formData.append("accountNumber", data.accountNumber);
      formData.append("email", email);
      formData.append("role", role);

      if (files.photo) formData.append("photo", files.photo);
      files.dni.forEach(file => formData.append("dni", file));
      if (files.academic) formData.append("academic", files.academic);
      if (files.form03) formData.append("form03", files.form03);

      if (resubmit) {
        await api.put(`/submission/update/${submissionId}`, formData);
      } else {
        await api.post("/submission/submit", formData);
      }

      await successAlert(
        "Éxito",
        resubmit
          ? "La información fue corregida correctamente"
          : "La información fue enviada correctamente"
      );

      navigate("/", { replace: true });
    } catch {
      errorAlert(
        "Error",
        "No se pudo enviar la información"
      );
    }
  };

  return (
    <Container>
      <h2>
        {resubmit
          ? "Corrección de información"
          : "Formulario de Registro"}
      </h2>

      {/* 📝 OBSERVACIONES DEL ADMIN */}
      {resubmit && existingFiles.adminObservation && (
        <div
          style={{
            background: "#FFF3CD",
            border: "1px solid #FFEEBA",
            padding: "10px",
            marginBottom: "15px",
          }}
        >
          <strong>Observaciones del administrador:</strong>
          <p>{existingFiles.adminObservation}</p>
        </div>
      )}

      <label>Nombre completo</label>
      <input
        type="text"
        value={data.fullName}
        onChange={e =>
          setData({ ...data, fullName: e.target.value })
        }
      />

      <label>Número de cuenta institucional</label>
      <input
        type="text"
        value={data.accountNumber}
        onChange={e =>
          setData({ ...data, accountNumber: e.target.value })
        }
      />

      <p><strong>Correo institucional:</strong> {email}</p>
      <p><strong>Cargo:</strong> {role}</p>

      <label>📷 Foto personal</label>
      {existingFiles.photo && <small>Archivo ya cargado</small>}
      <input
        type="file"
        accept="image/*"
        onChange={e =>
          setFiles({ ...files, photo: e.target.files[0] })
        }
      />

      <label>🪪 DNI (frontal y reverso)</label>
      {existingFiles.dni && <small>Archivos ya cargados</small>}
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={e =>
          setFiles({ ...files, dni: [...e.target.files] })
        }
      />

      <label>📄 Historial académico (PDF)</label>
      {existingFiles.academic && <small>Archivo ya cargado</small>}
      <input
        type="file"
        accept="application/pdf"
        onChange={e =>
          setFiles({ ...files, academic: e.target.files[0] })
        }
      />

      <label>📄 Forma 03 (PDF)</label>
      {existingFiles.form03 && <small>Archivo ya cargado</small>}
      <input
        type="file"
        accept="application/pdf"
        onChange={e =>
          setFiles({ ...files, form03: e.target.files[0] })
        }
      />

      <button onClick={submit}>
        {resubmit ? "Actualizar información" : "Enviar información"}
      </button>
      <Footer />
    </Container>
  );
}
