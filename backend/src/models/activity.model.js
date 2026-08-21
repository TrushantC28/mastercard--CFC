import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        activityDate: {
            type: Date,
            required: true,
        },
        location: {
            type: String,
        },
        corporatePartnerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CorporatePartner",
            required: true,
        },
        createdByAdminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        sourceProposalId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ActivityProposal",
            default: null,
        },
        volunteersRequired: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["planned", "open_for_signup", "ongoing", "completed", "cancelled"],
            default: "planned",
            required: true,
        },
    },
    {
        timestamps: true,
        collection: "activities",
    },
);

// Supports a SPOC dashboard's upcoming and completed activity views.
activitySchema.index({ corporatePartnerId: 1, status: 1 });

// Supports sorting and filtering activities by their scheduled date.
activitySchema.index({ activityDate: 1 });

// Supports finding activities created from an approved proposal.
activitySchema.index({ sourceProposalId: 1 });

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;