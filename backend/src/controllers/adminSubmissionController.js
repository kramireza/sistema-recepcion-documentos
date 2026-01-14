import { PrismaClient } from "@prisma/client";
import {
  sendCorrectionEmail,
  sendApprovedEmail,
  sendRejectedEmail,
} from "../services/emailService.js";

const prisma = new PrismaClient();

/**
 * 📋 Listar todas las solicitudes
 */
export const listSubmissions = async (req, res) => {
  try {
    const submissions = await prisma.submission.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo solicitudes" });
  }
};

/**
 * 🔄 Actualizar estado + observaciones + enviar correos
 */
export const updateSubmissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, observation } = req.body;

    const allowedStatuses = [
      "RECIBIDA",
      "EN_REVISION",
      "FALTA_INFORMACION",
      "APROBADA",
      "RECHAZADA",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Estado no válido" });
    }

    const submission = await prisma.submission.findUnique({
      where: { id: Number(id) },
    });

    if (!submission) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    // 🔄 Actualizar estado y observación
    const updated = await prisma.submission.update({
      where: { id: Number(id) },
      data: {
        status,
        adminObservation:
          status === "FALTA_INFORMACION"
            ? observation || "Sin observaciones"
            : null,
      },
    });

    // ✉️ Envío de correos automáticos
    if (status === "FALTA_INFORMACION") {
      await sendCorrectionEmail(
        submission.email,
        observation || "Sin observaciones"
      );
    }

    if (status === "APROBADA") {
      await sendApprovedEmail(submission.email);
    }

    if (status === "RECHAZADA") {
      await sendRejectedEmail(submission.email);
    }

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error actualizando estado" });
  }
};

/**
 * 🗑️ Eliminar solicitud (permite reenvío)
 */
export const deleteSubmission = async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await prisma.submission.findUnique({
      where: { id: Number(id) },
    });

    if (!submission) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    await prisma.submission.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Solicitud eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error eliminando solicitud" });
  }
};
