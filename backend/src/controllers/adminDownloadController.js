import { PrismaClient } from "@prisma/client";
import { generateSubmissionPDF } from "../services/pdfService.js";

const prisma = new PrismaClient();

export const downloadSubmissionPDF = async (req, res) => {
  const { id } = req.params;

  const submission = await prisma.submission.findUnique({
    where: { id: Number(id) },
  });

  if (!submission) {
    return res.status(404).json({ message: "Registro no encontrado" });
  }

  const pdfDoc = await generateSubmissionPDF(submission);
  const pdfBytes = await pdfDoc.save();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${submission.fullName}.pdf"`
  );

  res.send(Buffer.from(pdfBytes));
};
