import { Router } from "express";
import { submitFeedback, getFeedback } from "../controllers/feedback.controller.js";
import { exportFeedbackCSV } from "../controllers/feedbackExport.controller.js";
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
 * GET /feedback/export
 * Access: admin or spoc
 * NOTE: Must be defined before /feedback to prevent route pattern collision if parameterized
 */
router.get(
    "/feedback/export",
    requireAuth,
    requireRole("admin", "spoc"),
    exportFeedbackCSV
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
