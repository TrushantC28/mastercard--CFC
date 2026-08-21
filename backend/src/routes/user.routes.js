import { Router } from "express";
import { getCurrentUser, getUsers } from "../controllers/user.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

// GET /users/me - Any authenticated user
router.route("/me").get(requireAuth, getCurrentUser);

// GET /users - Admin only with optional filters and pagination
router.route("/").get(requireAuth, requireRole("admin"), getUsers);

export default router;
