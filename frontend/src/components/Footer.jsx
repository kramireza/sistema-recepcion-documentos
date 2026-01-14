import logo from "../assets/LogoIAVS.png";

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: "40px",
        padding: "20px",
        textAlign: "center",
        borderTop: "1px solid #ddd",
        fontSize: "14px",
        color: "#555",
      }}
    >
      <img
        src={logo}
        alt="Logo UNAH"
        style={{ height: "50px", marginBottom: "10px" }}
      />

      <p>
        Sistema de Recepción de Documentos – Asociación IAVS
      </p>

      <p>
        © {new Date().getFullYear()} Universidad Nacional Autónoma de Honduras
      </p>

      <p style={{ fontSize: "12px" }}>
        Todos los derechos reservados
      </p>
    </footer>
  );
}
