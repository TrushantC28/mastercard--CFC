import ActivityProposal from "../models/activityProposal.model.js";
import Activity from "../models/activity.model.js";
import "../models/corporatePartner.model.js";
import "../models/User.js";
import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";

export const createProposal = async ({
    corporatePartnerId,
    spocUserId,
    title,
    description,
    proposedDate,
    volunteersRequired,
}) => {
    return await ActivityProposal.create({
        corporatePartnerId,
        spocUserId,
        title: title.trim(),
        description: description?.trim(),
        proposedDate,
        volunteersRequired,
    });
};

export const listProposals = async ({
    role,
    corporatePartnerId,
    status,
}) => {
    const filter = {};

    if (status) {
        filter.status = status;
    }

    if (role === "spoc" || corporatePartnerId) {
        filter.corporatePartnerId = corporatePartnerId;
    }

    return await ActivityProposal.find(filter)
        .sort({ createdAt: -1 })
        .populate("corporatePartnerId", "name")
        .populate("spocUserId", "name email")
        .lean();
};

const createProcessedProposalError = (proposal) => {
    const error = new ApiError(
        409,
        `Proposal has already been ${proposal.status}.`
    );
    error.code = "PROPOSAL_ALREADY_PROCESSED";
    return error;
};

const getPendingProposal = async (proposalId, session) => {
    const proposal = await ActivityProposal.findById(proposalId).session(session);

    if (!proposal) {
        throw new ApiError(404, "Proposal not found.");
    }

    if (proposal.status !== "pending") {
        throw createProcessedProposalError(proposal);
    }

    return proposal;
};

export const approveProposal = async ({ proposalId, adminId, reviewNotes }) => {
    const session = await mongoose.startSession();

    try {
        let approvedProposal;
        let createdActivity;

        await session.withTransaction(async () => {
            const proposal = await getPendingProposal(proposalId, session);

            [createdActivity] = await Activity.create(
                [
                    {
                        title: proposal.title,
                        activityDate: proposal.proposedDate,
                        corporatePartnerId: proposal.corporatePartnerId,
                        createdByAdminId: adminId,
                        volunteersRequired: proposal.volunteersRequired,
                        description: proposal.description,
                        sourceProposalId: proposal._id,
                        status: "planned",
                    },
                ],
                { session }
            );

            proposal.status = "approved";
            proposal.reviewedByAdminId = adminId;
            if (reviewNotes !== undefined) {
                proposal.reviewNotes = reviewNotes.trim();
            }
            await proposal.save({ session });

            approvedProposal = proposal;
        });

        return {
            proposal: approvedProposal,
            activity: createdActivity,
        };
    } catch (error) {
        if (
            error.message?.includes(
                "Transaction numbers are only allowed on a replica set member or mongos"
            )
        ) {
            const transactionError = new ApiError(
                503,
                "Proposal approval requires a MongoDB deployment with transaction support."
            );
            transactionError.code = "TRANSACTIONS_UNAVAILABLE";
            throw transactionError;
        }
        throw error;
    } finally {
        await session.endSession();
    }
};

export const rejectProposal = async ({ proposalId, adminId, reviewNotes }) => {
    const update = {
        status: "rejected",
        reviewedByAdminId: adminId,
    };

    if (reviewNotes !== undefined) {
        update.reviewNotes = reviewNotes.trim();
    }

    const proposal = await ActivityProposal.findOneAndUpdate(
        { _id: proposalId, status: "pending" },
        { $set: update },
        { new: true, runValidators: true }
    );

    if (proposal) {
        return proposal;
    }

    const existingProposal = await ActivityProposal.findById(proposalId);
    if (!existingProposal) {
        throw new ApiError(404, "Proposal not found.");
    }

    throw createProcessedProposalError(existingProposal);
};
