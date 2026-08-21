import { Router } from "express";
import {
    getActivityRegistrations,
    getMyRegistrations,
    markAttendance,
    registerForActivity,
} from "../controllers/registration.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

router
    .route("/activities/:id/register")
    .post(requireAuth, requireRole("volunteer"), registerForActivity);

router
    .route("/activities/:id/registrations")
    .get(requireAuth, requireRole("admin", "spoc"), getActivityRegistrations);

router
    .route("/registrations/:id/attendance")
    .patch(requireAuth, requireRole("admin"), markAttendance);

router
    .route("/users/:id/registrations")
    .get(requireAuth, requireRole("volunteer", "admin"), getMyRegistrations);

export default router;
