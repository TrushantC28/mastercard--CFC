import mongoose from "mongoose";
import AiInsight from "../models/aiInsight.model.js";

/**
 * Controller: GET /ai-insights
 * Fetches AI pattern insights and actionable recommendations.
 * SPOC access is strictly scoped to their corporatePartnerId.
 * Admin access can view all or filter by company/status.
 */
export const getAiInsights = async (req, res) => {
    try {
        const { corporatePartnerId, status, severity } = req.query;
        const user = req.user;

        const filter = {};

        if (user.role === "spoc") {
            if (!user.corporatePartnerId) {
                return res.status(403).json({
                    error: "forbidden",
                    message: "SPOC user does not have a corporate partner assigned.",
                });
            }
            filter.corporatePartnerId = user.corporatePartnerId;
        } else if (corporatePartnerId && mongoose.Types.ObjectId.isValid(corporatePartnerId)) {
            filter.corporatePartnerId = corporatePartnerId;
        }

        if (status) filter.status = status;
        if (severity) filter.severity = severity;

        const insights = await AiInsight.find(filter)
            .sort({ createdAt: -1 })
            .populate("activityId", "title status")
            .populate("corporatePartnerId", "name")
            .populate("reviewedBy", "name email")
            .lean();

        // Calculate summary statistics
        const pendingCount = insights.filter(i => i.status === "pending_review").length;
        const acceptedCount = insights.filter(i => i.status === "accepted").length;
        const criticalCount = insights.filter(i => i.severity === "critical").length;

        return res.status(200).json({
            success: true,
            data: insights,
            summary: {
                totalInsights: insights.length,
                pendingReview: pendingCount,
                acceptedActions: acceptedCount,
                criticalAlerts: criticalCount,
            },
        });
    } catch (error) {
        console.error("Error fetching AI insights:", error);
        return res.status(500).json({
            error: "internal_error",
            message: "An unexpected error occurred while retrieving AI insights.",
        });
    }
};

/**
 * Controller: PATCH /ai-insights/:id/review
 * Allows Admin users to review, accept, modify, or reject AI recommendations.
 */
export const reviewAiInsight = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, recommendedAction, adminNotes } = req.body;
        const user = req.user;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                error: "bad_request",
                message: "Invalid AI insight ID format.",
            });
        }

        if (!["accepted", "modified", "rejected", "pending_review"].includes(status)) {
            return res.status(400).json({
                error: "bad_request",
                message: "Status must be one of: 'accepted', 'modified', 'rejected', 'pending_review'.",
            });
        }

        const insight = await AiInsight.findById(id);
        if (!insight) {
            return res.status(404).json({
                error: "not_found",
                message: "AI Insight record not found.",
            });
        }

        insight.status = status;
        if (recommendedAction) insight.recommendedAction = recommendedAction;
        if (adminNotes) insight.adminNotes = adminNotes;

        insight.reviewedBy = user._id;
        insight.reviewedAt = new Date();

        await insight.save();

        return res.status(200).json({
            success: true,
            message: `AI recommendation successfully updated to '${status}'.`,
            data: insight,
        });
    } catch (error) {
        console.error("Error reviewing AI insight:", error);
        return res.status(500).json({
            error: "internal_error",
            message: "An unexpected error occurred while reviewing AI insight.",
        });
    }
};
