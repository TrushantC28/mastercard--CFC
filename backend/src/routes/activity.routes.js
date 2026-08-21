import { Router } from "express";
import {
    createActivity,
    getActivities,
    updateActivityStatus,
} from "../controllers/activity.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import {
    validateActivityListQuery,
    validateActivityStatusUpdate,
    validateCreateActivity,
} from "../middleware/validator.middleware.js";

const router = Router();

router
    .route("/")
    .post(
        requireAuth,
        requireRole("admin"),
        validateCreateActivity,
        createActivity
    )
    .get(
        requireAuth,
        requireRole("admin", "spoc", "volunteer"),
        validateActivityListQuery,
        getActivities
    );

router
    .route("/:id/status")
    .patch(
        requireAuth,
        requireRole("admin"),
        validateActivityStatusUpdate,
        updateActivityStatus
    );

export default router;
