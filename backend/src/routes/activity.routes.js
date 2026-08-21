import { Router } from "express";
import {
    createActivity,
    getActivities,
    getActivityById,
    updateActivityStatus,
} from "../controllers/activity.controller.js";
import { verifyJWT, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

// POST /activities — admin direct-creates an activity
router.post(
    "/",
    verifyJWT,
    requireRole("admin"),
    createActivity
);

// GET /activities — all roles, server-side scoping per role in controller
router.get(
    "/",
    verifyJWT,
    requireRole("admin", "spoc", "volunteer"),
    getActivities
);

// GET /activities/:id — single activity (all roles; SPOC scoping enforced in controller)
router.get(
    "/:id",
    verifyJWT,
    requireRole("admin", "spoc", "volunteer"),
    getActivityById
);

// PATCH /activities/:id/status — admin only; enforces valid transition map
router.patch(
    "/:id/status",
    verifyJWT,
    requireRole("admin"),
    updateActivityStatus
);

export default router;
