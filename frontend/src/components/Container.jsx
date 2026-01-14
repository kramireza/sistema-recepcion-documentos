export default function Container({ children }) {
  return (
    <div style={{
      maxWidth: "520px",
      margin: "40px auto",
      background: "#fff",
      padding: "30px",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
    }}>
      {children}
    </div>
  );
}
