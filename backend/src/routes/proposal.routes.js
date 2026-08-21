import { Router } from "express";
import {
    submitProposal,
    getProposals,
    approveProposal,
    rejectProposal,
} from "../controllers/proposal.controller.js";
import { verifyJWT, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

// POST /proposals — SPOC submits a proposal
router.post(
    "/",
    verifyJWT,
    requireRole("spoc"),
    submitProposal
);

// GET /proposals — admin sees all; spoc sees only their company's (scoped in controller)
router.get(
    "/",
    verifyJWT,
    requireRole("admin", "spoc"),
    getProposals
);

// PATCH /proposals/:id/approve — admin approves and auto-creates Activity
router.patch(
    "/:id/approve",
    verifyJWT,
    requireRole("admin"),
    approveProposal
);

// PATCH /proposals/:id/reject — admin rejects
router.patch(
    "/:id/reject",
    verifyJWT,
    requireRole("admin"),
    rejectProposal
);

export default router;
