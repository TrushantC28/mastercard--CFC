import mongoose, { Schema } from "mongoose";

const activitySchema = new Schema(
    {
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
        activityDate: {
            type: Date,
            required: true,
        },
        location: {
            type: String,
            required: true,
            trim: true,
        },
        corporatePartnerId: {
            type: Schema.Types.ObjectId,
            ref: "CorporatePartner",
            required: true,
        },
        createdByAdminId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        sourceProposalId: {
            type: Schema.Types.ObjectId,
            ref: "ActivityProposal",
            default: null,
        },
        volunteersRequired: {
            type: Number,
            required: true,
            min: 1,
        },
        status: {
            type: String,
            enum: [
                "planned",
                "open_for_signup",
                "ongoing",
                "completed",
                "cancelled",
            ],
            default: "planned",
        },
    },
    { timestamps: true }
);

// Compound index for filtering by company + status
activitySchema.index({ corporatePartnerId: 1, status: 1 });
activitySchema.index({ activityDate: 1 });

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
