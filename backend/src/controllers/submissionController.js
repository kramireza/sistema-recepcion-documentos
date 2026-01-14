import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const submitForm = async (req, res) => {
  const {
    fullName,
    accountNumber,
    email,
    role,
  } = req.body;

  if (
    !fullName ||
    !accountNumber ||
    !email ||
    !role ||
    !req.files.photo ||
    !req.files.dni ||
    req.files.dni.length < 2 ||
    !req.files.academic ||
    !req.files.form03
  ) {
    return res.status(400).json({ message: "Formulario incompleto" });
  }

  await prisma.submission.create({
    data: {
      fullName,
      accountNumber,
      email,
      role,
      photoPath: req.files.photo[0].path,
      dniFrontPath: req.files.dni[0].path,
      dniBackPath: req.files.dni[1].path,
      academicRecordPath: req.files.academic[0].path,
      form03Path: req.files.form03[0].path,
    },
  });

  res.json({ message: "Información enviada correctamente" });
};

export const getSubmissionForEdit = async (req, res) => {
  const { id } = req.params;

  const submission = await prisma.submission.findUnique({
    where: { id: Number(id) },
  });

  if (!submission) {
    return res.status(404).json({ message: "Solicitud no encontrada" });
  }

  res.json(submission);
};

export const updateSubmission = async (req, res) => {
  const { id } = req.params;

  const submission = await prisma.submission.findUnique({
    where: { id: Number(id) },
  });

  if (!submission) {
    return res.status(404).json({ message: "Solicitud no encontrada" });
  }

  // ⚠️ Manejo de archivos: solo reemplazar si vienen nuevos
  const data = {
    fullName: req.body.fullName,
    accountNumber: req.body.accountNumber,
    status: "RECIBIDA",
  };

  if (req.files.photo) data.photoPath = req.files.photo[0].path;
  if (req.files.dni?.length === 2) {
    data.dniFrontPath = req.files.dni[0].path;
    data.dniBackPath = req.files.dni[1].path;
  }
  if (req.files.academic) data.academicRecordPath = req.files.academic[0].path;
  if (req.files.form03) data.form03Path = req.files.form03[0].path;

  await prisma.submission.update({
    where: { id: Number(id) },
    data,
  });

  res.json({ message: "Solicitud actualizada correctamente" });
};
