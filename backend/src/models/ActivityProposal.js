import mongoose, { Schema } from "mongoose";

const activityProposalSchema = new Schema(
    {
        corporatePartnerId: {
            type: Schema.Types.ObjectId,
            ref: "CorporatePartner",
            required: true,
        },
        spocUserId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        proposedDate: {
            type: Date,
            required: true,
        },
        volunteersRequired: {
            type: Number,
            required: true,
            min: 1,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        reviewedByAdminId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        reviewNotes: {
            type: String,
            default: null,
        },
        createdActivityId: {
            type: Schema.Types.ObjectId,
            ref: "Activity",
            default: null,
        },
    },
    { timestamps: true }
);

// Index for fast admin queue queries
activityProposalSchema.index({ status: 1, corporatePartnerId: 1 });

const ActivityProposal = mongoose.model("ActivityProposal", activityProposalSchema);

export default ActivityProposal;
