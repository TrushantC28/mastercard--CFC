import mongoose from "mongoose";
import Feedback from "../models/feedback.model.js";

/**
 * Helper to escape CSV text fields safely.
 */
const escapeCsvField = (field) => {
    if (field === null || field === undefined) return '""';
    const stringValue = String(field).replace(/"/g, '""');
    return `"${stringValue}"`;
};

/**
 * Controller: GET /feedback/export
 * Exports filtered feedback records as a downloadable CSV file.
 * Admin: Can export all feedback or filter by any corporate partner.
 * SPOC: Scoped strictly to their own corporatePartnerId.
 */
export const exportFeedbackCSV = async (req, res) => {
    try {
        const { activityId, corporatePartnerId, dateFrom, dateTo, minRating, themeId } = req.query;
        const user = req.user;

        const matchFilter = {};

        // 1. Role-based scoping: SPOC is locked to their corporatePartnerId from JWT claim
        if (user.role === "spoc") {
            if (!user.corporatePartnerId) {
                return res.status(403).json({
                    error: "forbidden",
                    message: "SPOC user does not have a corporate partner assigned.",
                });
            }
            matchFilter.corporatePartnerId = user.corporatePartnerId;
        } else if (corporatePartnerId && mongoose.Types.ObjectId.isValid(corporatePartnerId)) {
            matchFilter.corporatePartnerId = corporatePartnerId;
        }

        // 2. Query filters
        if (activityId && mongoose.Types.ObjectId.isValid(activityId)) {
            matchFilter.activityId = activityId;
        }

        if (minRating && !isNaN(Number(minRating))) {
            matchFilter.overallRating = { $gte: Number(minRating) };
        }

        if (dateFrom || dateTo) {
            matchFilter.submittedAt = {};
            if (dateFrom) matchFilter.submittedAt.$gte = new Date(dateFrom);
            if (dateTo) matchFilter.submittedAt.$lte = new Date(dateTo);
        }

        if (themeId && mongoose.Types.ObjectId.isValid(themeId)) {
            matchFilter["themes.themeId"] = themeId;
        }

        // 3. Fetch matched feedback records with populated references
        const feedbackRecords = await Feedback.find(matchFilter)
            .sort({ submittedAt: -1 })
            .populate("activityId", "title")
            .populate("corporatePartnerId", "name")
            .populate("volunteerId", "name email")
            .lean();

        // 4. Generate CSV Header and Rows
        const headers = [
            "Submitted At",
            "Activity Title",
            "Corporate Partner",
            "Volunteer Name",
            "Volunteer Email",
            "Overall Rating",
            "Organization Rating",
            "Impact Rating",
            "Comments",
            "Suggestions",
            "Extracted Themes",
            "Language",
            "Urgent Flag"
        ];

        const csvRows = [headers.map(escapeCsvField).join(",")];

        for (const fb of feedbackRecords) {
            const themesStr = (fb.themes || []).map(t => t.themeName).join("; ");
            const row = [
                fb.submittedAt ? new Date(fb.submittedAt).toISOString() : "",
                fb.activityId?.title || "",
                fb.corporatePartnerId?.name || "",
                fb.volunteerId?.name || "Anonymous",
                fb.volunteerId?.email || "",
                fb.overallRating || "",
                fb.organizationRating || "",
                fb.impactRating || "",
                fb.comments || "",
                fb.suggestions || "",
                themesStr,
                fb.language || "en",
                fb.isUrgent ? "YES" : "NO"
            ];
            csvRows.push(row.map(escapeCsvField).join(","));
        }

        const csvContent = csvRows.join("\n");
        const filename = `feedback_report_${new Date().toISOString().split("T")[0]}.csv`;

        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        return res.status(200).send(csvContent);
    } catch (error) {
        console.error("Error exporting feedback CSV:", error);
        return res.status(500).json({
            error: "internal_error",
            message: "An unexpected error occurred while exporting feedback.",
        });
    }
};
