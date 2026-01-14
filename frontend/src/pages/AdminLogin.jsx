import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Container from "../components/Container";
import Footer from "../components/Footer";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await api.post("/admin/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/admin/panel");
    } catch {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <Container>
      <h2>Acceso Administrador</h2>

      <label>Correo</label>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <label>Contraseña</label>
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button onClick={login}>Ingresar</button>
      <Footer />
    </Container>
  );
}
