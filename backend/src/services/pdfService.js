import fs from "fs";
import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function generateSubmissionPDF(submission) {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const page = pdfDoc.addPage([595, 842]); // A4
  let y = 800;

  const drawText = (text) => {
    page.drawText(text, {
      x: 50,
      y,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });
    y -= 20;
  };

  drawText("UNIVERSIDAD NACIONAL AUTÓNOMA DE HONDURAS");
  drawText("SISTEMA DE RECEPCIÓN DE DOCUMENTOS");
  y -= 20;

  drawText(`Nombre completo: ${submission.fullName}`);
  drawText(`Número de cuenta: ${submission.accountNumber}`);
  drawText(`Correo institucional: ${submission.email}`);
  drawText(`Cargo: ${submission.role}`);
  y -= 20;

  // FOTO PERSONAL
  const photoBytes = fs.readFileSync(submission.photoPath);
  const photoImage = submission.photoPath.endsWith(".png")
    ? await pdfDoc.embedPng(photoBytes)
    : await pdfDoc.embedJpg(photoBytes);

  page.drawImage(photoImage, {
    x: 50,
    y: y - 150,
    width: 120,
    height: 150,
  });

  y -= 180;

  // DNI
  const dniFrontBytes = fs.readFileSync(submission.dniFrontPath);
  const dniBackBytes = fs.readFileSync(submission.dniBackPath);

  const dniFrontImg = submission.dniFrontPath.endsWith(".png")
    ? await pdfDoc.embedPng(dniFrontBytes)
    : await pdfDoc.embedJpg(dniFrontBytes);

  const dniBackImg = submission.dniBackPath.endsWith(".png")
    ? await pdfDoc.embedPng(dniBackBytes)
    : await pdfDoc.embedJpg(dniBackBytes);

  page.drawText("DNI - Frontal y Reverso", { x: 50, y, size: 12, font });
  y -= 20;

  page.drawImage(dniFrontImg, { x: 50, y: y - 100, width: 180, height: 100 });
  page.drawImage(dniBackImg, { x: 260, y: y - 100, width: 180, height: 100 });

  // Adjuntar PDFs
  await attachPdf(pdfDoc, submission.academicRecordPath, "Historial Académico");
  await attachPdf(pdfDoc, submission.form03Path, "Forma 03");

  return pdfDoc;
}

async function attachPdf(pdfDoc, filePath, title) {
  const bytes = fs.readFileSync(filePath);
  const attachedPdf = await PDFDocument.load(bytes);
  const copiedPages = await pdfDoc.copyPages(attachedPdf, attachedPdf.getPageIndices());

  copiedPages.forEach((p) => pdfDoc.addPage(p));
}
