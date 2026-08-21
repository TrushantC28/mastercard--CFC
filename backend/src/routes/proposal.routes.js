import { Router } from "express";
import {
    createProposal,
    getProposals,
} from "../controllers/proposal.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import {
    validateCreateProposal,
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

export default router;
