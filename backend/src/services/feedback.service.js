import Activity from "../models/activity.model.js";
import EventRegistration from "../models/eventRegistration.model.js";
import Feedback from "../models/feedback.model.js";
import FeedbackTheme from "../models/feedbackTheme.model.js";
import CorporatePartner from "../models/corporatePartner.model.js";
import User from "../models/User.js";

/**
 * Checks whether a volunteer is eligible to submit feedback for an activity.
 * Must be status === "completed" and registration attendanceStatus === "attended".
 */
export const checkFeedbackEligibility = async (activityId, volunteerId) => {
    const activity = await Activity.findById(activityId).select("status corporatePartnerId").lean();
    if (!activity || activity.status !== "completed") {
        return { eligible: false, activity: null };
    }

    const registration = await EventRegistration.findOne({
        activityId,
        volunteerId,
        attendanceStatus: "attended",
    }).select("_id").lean();

    if (!registration) {
        return { eligible: false, activity: null };
    }

    return { eligible: true, activity };
};

/**
 * Creates feedback document.
 */
export const createFeedbackDoc = async ({
    activityId,
    volunteerId,
    corporatePartnerId,
    overallRating,
    organizationRating,
    impactRating,
    comments,
    suggestions,
    language = "en",
}) => {
    const feedbackDoc = new Feedback({
        activityId,
        volunteerId,
        corporatePartnerId,
        overallRating,
        organizationRating,
        impactRating,
        comments,
        suggestions,
        language: language || "en",
        themes: [],
        submittedAt: new Date(),
    });

    return await feedbackDoc.save();
};

/**
 * Retrieves feedback list with filters, joins, pagination, and calculated summary.
 */
export const getFeedbackWithSummary = async ({ filter, page = 1, limit = 20 }) => {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    // Execute query with joins and pagination
    const [rawFeedbacks, total] = await Promise.all([
        Feedback.find(filter)
            .sort({ submittedAt: -1, createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .populate({ path: "activityId", select: "title" })
            .populate({ path: "corporatePartnerId", select: "name" })
            .populate({ path: "volunteerId", select: "name" })
            .lean(),
        Feedback.countDocuments(filter),
    ]);

    // Format feedback array
    const feedback = rawFeedbacks.map((f) => ({
        id: f._id.toString(),
        activityId: f.activityId?._id ? f.activityId._id.toString() : (f.activityId ? f.activityId.toString() : ""),
        activityTitle: f.activityId?.title || "Unknown Activity",
        corporatePartnerId: f.corporatePartnerId?._id ? f.corporatePartnerId._id.toString() : (f.corporatePartnerId ? f.corporatePartnerId.toString() : ""),
        corporatePartnerName: f.corporatePartnerId?.name || "Unknown Corporate Partner",
        volunteerName: f.volunteerId?.name || "Anonymous Volunteer",
        overallRating: f.overallRating,
        organizationRating: f.organizationRating,
        impactRating: f.impactRating,
        comments: f.comments || "",
        suggestions: f.suggestions || "",
        themes: (f.themes || []).map((t) => ({
            themeId: t.themeId ? t.themeId.toString() : "",
            themeName: t.themeName || "",
            sentiment: t.sentiment || "positive",
        })),
        submittedAt: f.submittedAt ? f.submittedAt.toISOString() : (f.createdAt ? f.createdAt.toISOString() : new Date().toISOString()),
    }));

    // Calculate overall summary across ALL filter-matched records
    const [summaryAgg, themeAgg] = await Promise.all([
        Feedback.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: null,
                    avgRating: { $avg: "$overallRating" },
                },
            },
        ]),
        Feedback.aggregate([
            { $match: filter },
            { $unwind: "$themes" },
            {
                $group: {
                    _id: "$themes.themeName",
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
            { $limit: 5 },
        ]),
    ]);

    const averageOverallRating = summaryAgg.length > 0 && summaryAgg[0].avgRating
        ? Math.round(summaryAgg[0].avgRating * 10) / 10
        : 0;

    const topThemes = themeAgg.map((t) => ({
        themeName: t._id || "General Feedback",
        count: t.count,
    }));

    const summary = {
        averageOverallRating,
        totalResponses: total,
        topThemes,
    };

    return {
        feedback,
        summary,
        page: pageNum,
        limit: limitNum,
        total,
    };
};