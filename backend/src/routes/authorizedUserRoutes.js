import express from "express";
import multer from "multer";
import { uploadAuthorizedUsers } from "../controllers/authorizedUserController.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const upload = multer({ dest: "uploads/tmp" });

const router = express.Router();

router.post("/upload", adminAuth, upload.single("file"), uploadAuthorizedUsers);

export default router;
