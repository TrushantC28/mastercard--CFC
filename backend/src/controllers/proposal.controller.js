import ActivityProposal from "../models/ActivityProposal.js";
import Activity from "../models/Activity.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// ─────────────────────────────────────────────────────────────────────────────
// POST /proposals — SPOC submits a new proposal
// corporatePartnerId and spocUserId are pulled from the authenticated token
// ─────────────────────────────────────────────────────────────────────────────
export const submitProposal = asyncHandler(async (req, res) => {
    const { title, description, proposedDate, volunteersRequired } = req.body;

    if (!title || !description || !proposedDate || !volunteersRequired) {
        throw new ApiError(400, "One or more fields are invalid.", [], {
            fields: {
                title: !title ? "Title is required." : undefined,
                description: !description ? "Description is required." : undefined,
                proposedDate: !proposedDate ? "Proposed date is required." : undefined,
                volunteersRequired: !volunteersRequired
                    ? "Volunteers required is required."
                    : undefined,
            },
        });
    }

    // corporatePartnerId must exist on the SPOC user (enforced at registration by Backend 1)
    if (!req.user.corporatePartnerId) {
        throw new ApiError(403, "SPOC account is not linked to a corporate partner.");
    }

    const proposal = await ActivityProposal.create({
        corporatePartnerId: req.user.corporatePartnerId,
        spocUserId: req.user._id,
        title,
        description,
        proposedDate,
        volunteersRequired,
    });

    return res
        .status(201)
        .json(
            new ApiResponse(201, formatProposal(proposal), "Proposal submitted successfully.")
        );
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /proposals
// admin  → all proposals, filterable by status + corporatePartnerId
// spoc   → auto-scoped to their own corporatePartnerId, filterable by status
// ─────────────────────────────────────────────────────────────────────────────
export const getProposals = asyncHandler(async (req, res) => {
    const { status, corporatePartnerId, page = 1, limit = 20 } = req.query;

    const filter = {};

    if (req.user.role === "spoc") {
        // RBAC scoping — always use the token's companyId, never the client's
        filter.corporatePartnerId = req.user.corporatePartnerId;
    } else if (req.user.role === "admin" && corporatePartnerId) {
        filter.corporatePartnerId = corporatePartnerId;
    }

    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [proposals, total] = await Promise.all([
        ActivityProposal.find(filter)
            .populate("corporatePartnerId", "name")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),
        ActivityProposal.countDocuments(filter),
    ]);

    const formatted = proposals.map((p) => ({
        id: p._id,
        corporatePartnerId: p.corporatePartnerId?._id ?? p.corporatePartnerId,
        corporatePartnerName: p.corporatePartnerId?.name ?? null,
        spocUserId: p.spocUserId,
        title: p.title,
        proposedDate: p.proposedDate,
        volunteersRequired: p.volunteersRequired,
        status: p.status,
        reviewNotes: p.reviewNotes,
        reviewedByAdminId: p.reviewedByAdminId,
        createdAt: p.createdAt,
    }));

    return res.status(200).json(
        new ApiResponse(200, {
            proposals: formatted,
            page: Number(page),
            limit: Number(limit),
            total,
        })
    );
});

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /proposals/:id/approve — admin approves; auto-creates Activity
// ─────────────────────────────────────────────────────────────────────────────
export const approveProposal = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { reviewNotes } = req.body;

    const proposal = await ActivityProposal.findById(id);
    if (!proposal) throw new ApiError(404, "Proposal not found.");
    if (proposal.status !== "pending") {
        throw new ApiError(409, `Proposal is already '${proposal.status}'. Only pending proposals can be approved.`);
    }

    // Auto-create the linked Activity
    const activity = await Activity.create({
        title: proposal.title,
        description: proposal.description,
        activityDate: proposal.proposedDate,
        location: "TBD", // SPOC proposals don't carry a location; admin can update via PATCH /activities/:id/status
        corporatePartnerId: proposal.corporatePartnerId,
        createdByAdminId: req.user._id,
        sourceProposalId: proposal._id,
        volunteersRequired: proposal.volunteersRequired,
        status: "planned",
    });

    proposal.status = "approved";
    proposal.reviewedByAdminId = req.user._id;
    proposal.reviewNotes = reviewNotes ?? null;
    proposal.createdActivityId = activity._id;
    await proposal.save();

    return res.status(200).json(
        new ApiResponse(200, {
            id: proposal._id,
            status: proposal.status,
            reviewedByAdminId: proposal.reviewedByAdminId,
            reviewNotes: proposal.reviewNotes,
            createdActivityId: activity._id,
        }, "Proposal approved and activity created.")
    );
});

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /proposals/:id/reject — admin rejects a pending proposal
// ─────────────────────────────────────────────────────────────────────────────
export const rejectProposal = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { reviewNotes } = req.body;

    const proposal = await ActivityProposal.findById(id);
    if (!proposal) throw new ApiError(404, "Proposal not found.");
    if (proposal.status !== "pending") {
        throw new ApiError(409, `Proposal is already '${proposal.status}'. Only pending proposals can be rejected.`);
    }

    proposal.status = "rejected";
    proposal.reviewedByAdminId = req.user._id;
    proposal.reviewNotes = reviewNotes ?? null;
    await proposal.save();

    return res.status(200).json(
        new ApiResponse(200, {
            id: proposal._id,
            status: proposal.status,
            reviewedByAdminId: proposal.reviewedByAdminId,
            reviewNotes: proposal.reviewNotes,
        }, "Proposal rejected.")
    );
});

// ─────────────────────────────────────────────────────────────────────────────
// Internal helper
// ─────────────────────────────────────────────────────────────────────────────
function formatProposal(p) {
    return {
        id: p._id,
        corporatePartnerId: p.corporatePartnerId,
        spocUserId: p.spocUserId,
        title: p.title,
        description: p.description,
        proposedDate: p.proposedDate,
        volunteersRequired: p.volunteersRequired,
        status: p.status,
        reviewedByAdminId: p.reviewedByAdminId,
        reviewNotes: p.reviewNotes,
        createdAt: p.createdAt,
    };
}
