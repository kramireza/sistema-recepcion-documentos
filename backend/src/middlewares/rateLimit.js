import rateLimit from "express-rate-limit";

export const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Demasiados intentos. Intente más tarde.",
});

export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
});
