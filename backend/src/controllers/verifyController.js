import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const verifyUser = async (req, res) => {
  const { email, role } = req.body;

  if (!email || !role) {
    return res.status(400).json({ message: "Datos incompletos" });
  }

  const normalizedEmail = email.toLowerCase();

  // 🔐 Verificar autorización
  const authorized = await prisma.authorizedUser.findFirst({
    where: {
      email: normalizedEmail,
      role,
    },
  });

  if (!authorized) {
    return res.status(403).json({ message: "Usuario no autorizado" });
  }

  // ⛔ Verificar si ya envió datos
  const submitted = await prisma.submission.findFirst({
    where: { email: normalizedEmail },
  });

  if (submitted) {
    if (submitted.status === "FALTA_INFORMACION") {
      // 🔁 Permitir corrección
      return res.json({
        email: normalizedEmail,
        role,
        resubmit: true,
        submissionId: submitted.id,
      });
    }

    return res.status(409).json({
      message: "Ya enviaste tu información",
      alreadySubmitted: true,
    });
  }

  // Nuevo envío
  res.json({
    email: normalizedEmail,
    role,
    resubmit: false,
  });
};
