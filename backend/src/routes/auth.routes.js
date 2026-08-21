import { Router } from "express";
import { register, login, logout } from "../controllers/auth.controller.js";
import { authRateLimiter } from "../middleware/rateLimiter.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(authRateLimiter, register);
router.route("/login").post(authRateLimiter, login);
router.route("/logout").post(requireAuth, logout);

export default router;
