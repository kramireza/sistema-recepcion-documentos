import express from "express";
import { adminLogin } from "../controllers/adminAuthController.js";
import { adminLimiter } from "../middlewares/rateLimit.js";

const router = express.Router();

router.post("/login", adminLimiter, adminLogin);

export default router;
