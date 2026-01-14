import express from "express";
import { downloadSubmissionPDF } from "../controllers/adminDownloadController.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const router = express.Router();

router.get("/:id/pdf", adminAuth, downloadSubmissionPDF);

export default router;
