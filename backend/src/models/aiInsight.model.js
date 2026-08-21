import mongoose from "mongoose";

const aiInsightSchema = new mongoose.Schema(
    {
        activityId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Activity",
        },
        corporatePartnerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CorporatePartner",
            required: true,
        },
        themeName: {
            type: String,
            required: true,
        },
        recurringCount: {
            type: Number,
            required: true,
            default: 1,
        },
        severity: {
            type: String,
            enum: ["low", "medium", "high", "critical"],
            default: "medium",
        },
        insightText: {
            type: String,
            required: true,
        },
        recommendedAction: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending_review", "accepted", "modified", "rejected"],
            default: "pending_review",
        },
        adminNotes: {
            type: String,
        },
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        reviewedAt: {
            type: Date,
        },
        initialAverageRating: {
            type: Number,
        },
        postActionAverageRating: {
            type: Number,
        },
        effectivenessScore: {
            type: Number,
        },
    },
    {
        timestamps: true,
        collection: "aiInsights",
    }
);

aiInsightSchema.index({ corporatePartnerId: 1, status: 1 });
aiInsightSchema.index({ severity: 1 });

const AiInsight = mongoose.model("AiInsight", aiInsightSchema);

export default AiInsight;
