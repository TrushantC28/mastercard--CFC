import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
    createProposal as createProposalRecord,
    listProposals as listProposalRecords,
} from "../services/proposal.service.js";

export const createProposal = asyncHandler(async (req, res) => {
    const corporatePartnerId = req.user?.corporatePartnerId;
    const spocUserId = req.user?._id || req.user?.userId;

    if (!corporatePartnerId || !spocUserId) {
        throw new ApiError(403, "A SPOC corporate partner is required.");
    }

    const proposal = await createProposalRecord({
        corporatePartnerId,
        spocUserId,
        title: req.body.title,
        description: req.body.description,
        proposedDate: req.body.proposedDate,
        volunteersRequired: req.body.volunteersRequired,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, proposal, "Proposal submitted successfully"));
});

export const getProposals = asyncHandler(async (req, res) => {
    const isSpoc = req.user.role === "spoc";
    const corporatePartnerId = isSpoc
        ? req.user.corporatePartnerId
        : req.query.corporatePartnerId;

    if (isSpoc && !corporatePartnerId) {
        throw new ApiError(403, "A SPOC corporate partner is required.");
    }

    const proposals = await listProposalRecords({
        role: req.user.role,
        corporatePartnerId,
        status: req.query.status,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, proposals, "Proposals fetched successfully"));
});
