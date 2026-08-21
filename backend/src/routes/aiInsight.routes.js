import { Router } from "express";
import { getAiInsights, reviewAiInsight } from "../controllers/aiInsight.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * GET /ai-insights
 * Access: admin or spoc
 */
router.get(
    "/ai-insights",
    requireAuth,
    requireRole("admin", "spoc"),
    getAiInsights
);

/**
 * PATCH /ai-insights/:id/review
 * Access: admin only
 */
router.patch(
    "/ai-insights/:id/review",
    requireAuth,
    requireRole("admin"),
    reviewAiInsight
);

export default router;
