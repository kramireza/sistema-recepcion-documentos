import express from "express";
import { body } from "express-validator";
import { verifyUser } from "../controllers/verifyController.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { verifyLimiter } from "../middlewares/rateLimit.js";

const router = express.Router();

router.post(
  "/verify",
  verifyLimiter,
  [
    body("email").isEmail(),
    body("role").notEmpty(),
  ],
  validateRequest,
  verifyUser
);

export default router;
