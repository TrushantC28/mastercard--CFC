import { Router } from "express";
import { submitFeedback, getFeedback } from "../controllers/feedback.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * POST /activities/:id/feedback
 * Access: volunteer only
 */
router.post(
    "/activities/:id/feedback",
    requireAuth,
    requireRole("volunteer"),
    submitFeedback
);

/**
 * GET /feedback
 * Access: admin or spoc
 */
router.get(
    "/feedback",
    requireAuth,
    requireRole("admin", "spoc"),
    getFeedback
);

export default router;
