import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Container from "../components/Container";
import { errorAlert } from "../services/alerts";
import Footer from "../components/Footer";

export default function VerifyPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [showAdmin, setShowAdmin] = useState(false);

  const navigate = useNavigate();

  const cargos = [
    "Presidencia",
    "Vice-Presidencia",
    "Secretaria de Finanzas",
    "Secretaria General",
    "Fiscalia",
    "Secretaria de Accion Social",
    "Secretaria de Publicidad",
    "Secretaria del Interior",
    "Secretaria de Relaciones Exteriores",
    "Pro-Secretaria de Finanzas",
    "Vocal 1",
  ];

  // 🎹 Combinación secreta: Ctrl + Shift + Z
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "z") {
        setShowAdmin(true);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const verify = async () => {
    if (!email || !role) {
      errorAlert(
        "Datos incompletos",
        "Debes ingresar el correo y seleccionar un cargo"
      );
      return;
    }

    try {
      const res = await api.post("/verify", { email, role });

      // 🔁 Corrección de información
      if (res.data.resubmit) {
        navigate("/form", {
          state: {
            email: res.data.email,
            role: res.data.role,
            resubmit: true,
            submissionId: res.data.submissionId,
          },
        });
        return;
      }

      // 🆕 Nuevo envío
      navigate("/form", { state: res.data });
    } catch (error) {
      if (error.response?.status === 409) {
        errorAlert(
          "Información ya enviada",
          "Tu solicitud ya fue enviada y no requiere correcciones."
        );
      } else {
        errorAlert(
          "Acceso denegado",
          "Correo o cargo no autorizado"
        );
      }
    }
  };

  return (
    <Container>
      <h2>Verificación de Usuario</h2>

      <label>Correo institucional</label>
      <input
        type="email"
        placeholder="usuario@unah.hn"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <label>Cargo a ocupar</label>
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="">-- Seleccione un cargo --</option>
        {cargos.map(cargo => (
          <option key={cargo} value={cargo}>
            {cargo}
          </option>
        ))}
      </select>

      <button onClick={verify}>Verificar</button>

      {/* 🔐 Acceso admin oculto */}
      {showAdmin && (
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <button
            onClick={() => navigate("/admin")}
            style={{
              background: "#003366",
              color: "#fff",
              padding: "8px 16px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Administración
          </button>
        </div>
      )}
      <Footer />
    </Container>
  );
}
