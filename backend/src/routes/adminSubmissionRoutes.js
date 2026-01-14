import express from "express";
import {
  listSubmissions,
  updateSubmissionStatus,
  deleteSubmission,
} from "../controllers/adminSubmissionController.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const router = express.Router();

router.get("/", adminAuth, listSubmissions);
router.put("/:id/status", adminAuth, updateSubmissionStatus);
router.delete("/:id", adminAuth, deleteSubmission);

export default router;
