import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import verifyRoutes from "./routes/verifyRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import authorizedUserRoutes from "./routes/authorizedUserRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import adminSubmissionRoutes from "./routes/adminSubmissionRoutes.js";
import adminDownloadRoutes from "./routes/adminDownloadRoutes.js";

// 🔐 Cargar variables de entorno
dotenv.config();

const app = express();

/* ==============================
   🔐 SEGURIDAD GLOBAL
============================== */

// 🛡️ Headers de seguridad HTTP
app.use(helmet());

// 🌐 CORS (puedes restringir dominio en producción)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 📦 Parseo JSON
app.use(express.json({ limit: "10mb" }));

// 📁 Archivos subidos
app.use("/uploads", express.static("uploads"));

/* ==============================
   📌 RUTAS
============================== */

// 🔎 Verificación de usuarios
app.use("/api", verifyRoutes);

// 🔐 Autenticación admin
app.use("/api/admin", adminAuthRoutes);

// 📂 Usuarios autorizados (CSV / Excel)
app.use("/api/admin/authorized-users", authorizedUserRoutes);

// 📝 Envío y edición de formularios
app.use("/api/submission", submissionRoutes);

// 📊 Gestión de solicitudes (admin)
app.use("/api/admin/submissions", adminSubmissionRoutes);

// 📥 Descarga PDF consolidado
app.use("/api/admin/download", adminDownloadRoutes);

/* ==============================
   ❌ MANEJO DE ERRORES
============================== */

// ❌ Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// ❌ Error global (por ejemplo multer, validaciones, etc.)
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({
    message: "Error interno del servidor",
  });
});

/* ==============================
   🚀 SERVIDOR
============================== */

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(
    `🚀 API Sistema de Recepción de Documentos corriendo en http://localhost:${PORT}`
  );
});
