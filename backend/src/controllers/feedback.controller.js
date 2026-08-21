import mongoose from "mongoose";
import Feedback from "../models/feedback.model.js";
import { checkFeedbackEligibility, createFeedbackDoc, getFeedbackWithSummary } from "../services/feedback.service.js";
import { classifyFeedbackAsync } from "../services/classifier.service.js";

/**
 * POST /activities/:id/feedback
 * Volunteer submits feedback for an attended, completed activity.
 */
export const submitFeedback = async (req, res, next) => {
    try {
        const activityId = req.params.id;
        const volunteerId = req.user._id || req.user.userId;
        const userRole = req.user.role;

        // 1. RBAC Guard (Volunteer only)
        if (userRole !== "volunteer") {
            return res.status(403).json({
                success: false,
                error: {
                    code: "FORBIDDEN",
                    message: "You do not have permission to perform this action.",
                },
            });
        }

        // 2. Duplicate Guard (Check existing submission)
        const existingFeedback = await Feedback.findOne({ activityId, volunteerId }).lean();
        if (existingFeedback) {
            return res.status(409).json({
                error: "conflict",
                message: "You have already submitted feedback for this activity.",
            });
        }

        // 3. Eligibility Checks (Activity completed & Registration attended)
        const { eligible, activity } = await checkFeedbackEligibility(activityId, volunteerId);
        if (!eligible || !activity) {
            return res.status(403).json({
                error: "forbidden",
                message: "Feedback can only be submitted after attending a completed activity.",
            });
        }

        const {
            overallRating,
            organizationRating,
            impactRating,
            comments,
            suggestions,
            language = "en",
        } = req.body;

        // 4. Save feedback doc
        let savedFeedback;
        try {
            savedFeedback = await createFeedbackDoc({
                activityId,
                volunteerId,
                corporatePartnerId: activity.corporatePartnerId,
                overallRating: Number(overallRating),
                organizationRating: organizationRating ? Number(organizationRating) : undefined,
                impactRating: impactRating ? Number(impactRating) : undefined,
                comments,
                suggestions,
                language,
            });
        } catch (dbErr) {
            if (dbErr.code === 11000) {
                return res.status(409).json({
                    error: "conflict",
                    message: "You have already submitted feedback for this activity.",
                });
            }
            throw dbErr;
        }

        // 5. Trigger classification async (don't await)
        classifyFeedbackAsync(savedFeedback._id).catch((err) => {
            console.error("Async classification error:", err);
        });

        // 6. Return 201 response with exact matching contract shape
        return res.status(201).json({
            id: savedFeedback._id.toString(),
            activityId: savedFeedback.activityId.toString(),
            volunteerId: savedFeedback.volunteerId.toString(),
            corporatePartnerId: savedFeedback.corporatePartnerId.toString(),
            overallRating: savedFeedback.overallRating,
            organizationRating: savedFeedback.organizationRating,
            impactRating: savedFeedback.impactRating,
            comments: savedFeedback.comments || "",
            suggestions: savedFeedback.suggestions || "",
            language: savedFeedback.language || "en",
            themes: [],
            submittedAt: savedFeedback.submittedAt ? savedFeedback.submittedAt.toISOString() : new Date().toISOString(),
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /feedback
 * Admin retrieves all feedback (filterable). SPOC is auto-scoped to their own company.
 */
export const getFeedback = async (req, res, next) => {
    try {
        const userRole = req.user.role;
        const userPartnerId = req.user.corporatePartnerId;

        // RBAC check
        if (userRole !== "admin" && userRole !== "spoc") {
            return res.status(403).json({
                success: false,
                error: {
                    code: "FORBIDDEN",
                    message: "You do not have permission to perform this action.",
                },
            });
        }

        const filter = {};

        // Scope company access
        if (userRole === "spoc") {
            // SPOC: corporatePartnerId locked to token value (never trust query param)
            if (!userPartnerId) {
                return res.status(403).json({
                    success: false,
                    error: {
                        code: "FORBIDDEN",
                        message: "SPOC account is not associated with a corporate partner.",
                    },
                });
            }
            filter.corporatePartnerId = new mongoose.Types.ObjectId(userPartnerId);
        } else if (req.query.corporatePartnerId) {
            // Admin can filter by corporatePartnerId if provided
            filter.corporatePartnerId = new mongoose.Types.ObjectId(req.query.corporatePartnerId);
        }

        // Activity filter
        if (req.query.activityId) {
            filter.activityId = new mongoose.Types.ObjectId(req.query.activityId);
        }

        // Rating filter
        if (req.query.minRating) {
            filter.overallRating = { $gte: Number(req.query.minRating) };
        }

        // Date range filter
        if (req.query.dateFrom || req.query.dateTo) {
            filter.submittedAt = {};
            if (req.query.dateFrom) {
                filter.submittedAt.$gte = new Date(req.query.dateFrom);
            }
            if (req.query.dateTo) {
                const dateTo = new Date(req.query.dateTo);
                if (!req.query.dateTo.includes("T")) {
                    dateTo.setHours(23, 59, 59, 999);
                }
                filter.submittedAt.$lte = dateTo;
            }
        }

        // Theme filter
        if (req.query.themeId) {
            filter["themes.themeId"] = new mongoose.Types.ObjectId(req.query.themeId);
        }

        const { page = 1, limit = 20 } = req.query;

        const result = await getFeedbackWithSummary({ filter, page, limit });

        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
