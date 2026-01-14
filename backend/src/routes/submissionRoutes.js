import express from "express";
import {
  submitForm,
  getSubmissionForEdit,
  updateSubmission,
} from "../controllers/submissionController.js";
import { upload } from "../services/uploadService.js";

const router = express.Router();

const uploadFields = upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "dni", maxCount: 2 },
  { name: "academic", maxCount: 1 },
  { name: "form03", maxCount: 1 },
]);

router.post("/submit", uploadFields, submitForm);
router.get("/edit/:id", getSubmissionForEdit);
router.put("/update/:id", uploadFields, updateSubmission);

export default router;
