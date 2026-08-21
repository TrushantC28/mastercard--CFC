import mongoose from "mongoose";

const activityProposalSchema = new mongoose.Schema(
    {
        corporatePartnerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CorporatePartner",
            required: true,
        },
        spocUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        proposedDate: {
            type: Date,
            required: true,
        },
        volunteersRequired: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
            required: true,
        },
        reviewedByAdminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        reviewNotes: {
            type: String,
        },
    },
    {
        timestamps: true,
        collection: "activityProposals",
    },
);

// Supports a SPOC dashboard's proposal history filtered by partner and status.
activityProposalSchema.index({ corporatePartnerId: 1, status: 1 });

// Supports lookups of proposals submitted by a SPOC.
activityProposalSchema.index({ spocUserId: 1 });

const ActivityProposal = mongoose.model("ActivityProposal", activityProposalSchema);

export default ActivityProposal;