import { logout } from "../services/auth";
import { useNavigate } from "react-router-dom";

export default function AdminHeader() {
  const navigate = useNavigate();

  const salir = () => {
    logout();          // 🔐 eliminar token
    navigate("/", {    // 🔄 volver a VerifyPage
      replace: true
    });
  };

  return (
    <div style={{ textAlign: "right", marginBottom: "20px" }}>
      <button onClick={salir}>Cerrar sesión</button>
    </div>
  );
}
