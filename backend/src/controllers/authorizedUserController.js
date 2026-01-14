import fs from "fs";
import path from "path";
import { parse } from "csv-parse";
import xlsx from "xlsx";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const uploadAuthorizedUsers = async (req, res) => {
  const filePath = req.file.path;
  const ext = path.extname(req.file.originalname).toLowerCase();

  let records = [];

  try {
    if (ext === ".csv") {
      records = await parseCSV(filePath);
    } else if (ext === ".xlsx" || ext === ".xls") {
      records = parseExcel(filePath);
    } else {
      return res.status(400).json({ message: "Formato no soportado" });
    }

    const result = await processUsers(records);

    res.json({
      message: "Carga completada",
      registros_procesados: records.length,
      registros_insertados: result.inserted,
      registros_omitidos: result.skipped,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error procesando archivo" });
  } finally {
    fs.unlinkSync(filePath);
  }
};

// ---------------- UTILIDADES ----------------

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

async function processUsers(records) {
  let inserted = 0;
  let skipped = 0;

  for (const row of records) {
    // 🔑 Normalizar nombres de columnas
    const email = row.email || row.Email || row.correo || row.Correo;
    const role = row.role || row.Role || row.cargo || row.Cargo;

    if (!email || !role) {
      skipped++;
      continue;
    }

    if (!normalize(email).endsWith("@unah.hn")) {
      skipped++;
      continue;
    }

    const exists = await prisma.authorizedUser.findFirst({
      where: {
        email: normalize(email),
        role: role.trim(),
      },
    });

    if (!exists) {
      await prisma.authorizedUser.create({
        data: {
          email: normalize(email),
          role: role.trim(),
        },
      });
      inserted++;
    } else {
      skipped++;
    }
  }

  return { inserted, skipped };
}

function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(parse({ columns: true, trim: true }))
      .on("data", data => results.push(data))
      .on("end", () => resolve(results))
      .on("error", err => reject(err));
  });
}

function parseExcel(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return xlsx.utils.sheet_to_json(sheet);
}
