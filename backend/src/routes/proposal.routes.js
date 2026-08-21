import { Router } from "express";
import {
    approveProposal,
    createProposal,
    getProposals,
    rejectProposal,
} from "../controllers/proposal.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import {
    validateCreateProposal,
    validateProposalDecision,
    validateProposalListQuery,
} from "../middleware/validator.middleware.js";

const router = Router();

router
    .route("/")
    .post(
        requireAuth,
        requireRole("spoc"),
        validateCreateProposal,
        createProposal
    )
    .get(
        requireAuth,
        requireRole("admin", "spoc"),
        validateProposalListQuery,
        getProposals
    );

router
    .route("/:id/approve")
    .patch(
        requireAuth,
        requireRole("admin"),
        validateProposalDecision,
        approveProposal
    );

router
    .route("/:id/reject")
    .patch(
        requireAuth,
        requireRole("admin"),
        validateProposalDecision,
        rejectProposal
    );

export default router;
