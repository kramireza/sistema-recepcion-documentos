import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createAdmin() {
  const email = "admin@unah.hn";
  const password = "admin123";

  const exists = await prisma.admin.findUnique({ where: { email } });
  if (exists) {
    console.log("Admin ya existe");
    return;
  }

  const hashed = await bcrypt.hash(password, 10);

  await prisma.admin.create({
    data: {
      email,
      password: hashed,
    },
  });

  console.log("Admin creado correctamente");
}

createAdmin();
