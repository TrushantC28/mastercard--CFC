import Feedback from "../models/feedback.model.js";
import AiInsight from "../models/aiInsight.model.js";
import Activity from "../models/activity.model.js";

/**
 * Built-in AI Recommendation Knowledge Map.
 * Provides specific, actionable operational recommendations based on recurring themes.
 */
const RECOMMENDATION_KNOWLEDGE_BASE = {
    "Timing/logistics": {
        action: "Improve transportation instructions, adjust start times by 30 mins, and assign a dedicated transport coordinator.",
        baseSeverity: "medium",
    },
    "High impact felt": {
        action: "Highlight volunteer stories in post-event impact communications to boost engagement.",
        baseSeverity: "low",
    },
    "Organization & Safety": {
        action: "Conduct a pre-activity safety briefing, provide first-aid kits, and post clear signage at venue.",
        baseSeverity: "high",
    },
    "Food & Refreshments": {
        action: "Review vendor food quality standards and ensure adequate water supply throughout the event.",
        baseSeverity: "medium",
    },
    "Communication & Guidance": {
        action: "Send clear briefing packages 48 hours in advance and assign team leads for volunteer groups.",
        baseSeverity: "medium",
    },
};

/**
 * AI Pattern Finder & Insight Generator.
 * Scans recent feedback for a corporate partner / activity, identifies recurring issues,
 * and generates actionable recommendations for Admins & SPOCs.
 * 
 * @param {string|ObjectId} activityId 
 */
export const runAiPatternAnalysis = async (activityId) => {
    try {
        const activity = await Activity.findById(activityId);
        if (!activity) return;

        const corporatePartnerId = activity.corporatePartnerId;

        // 1. Fetch feedback for this activity and recent activities of the same corporate partner
        const recentFeedback = await Feedback.find({ corporatePartnerId })
            .sort({ submittedAt: -1 })
            .limit(50)
            .lean();

        if (!recentFeedback || recentFeedback.length === 0) return;

        // 2. Aggregate theme frequency and ratings
        const themeStats = {};
        let totalRatingSum = 0;

        for (const fb of recentFeedback) {
            totalRatingSum += fb.overallRating || 0;
            if (Array.isArray(fb.themes)) {
                for (const t of fb.themes) {
                    if (!themeStats[t.themeName]) {
                        themeStats[t.themeName] = { count: 0, sentiment: t.sentiment, lowRatingCount: 0 };
                    }
                    themeStats[t.themeName].count += 1;
                    if (fb.overallRating <= 2 || t.sentiment === "negative") {
                        themeStats[t.themeName].lowRatingCount += 1;
                    }
                }
            }
        }

        const avgRating = recentFeedback.length > 0 ? (totalRatingSum / recentFeedback.length).toFixed(1) : 5;

        // 3. Identify recurring patterns (issues reported >= 2 times or with low ratings)
        for (const [themeName, stats] of Object.entries(themeStats)) {
            if (stats.count >= 2 || stats.lowRatingCount >= 1) {
                // Determine severity
                let severity = "medium";
                if (stats.lowRatingCount >= 3 || avgRating < 3.0) severity = "critical";
                else if (stats.lowRatingCount >= 2) severity = "high";
                else if (stats.sentiment === "positive") severity = "low";

                const kb = RECOMMENDATION_KNOWLEDGE_BASE[themeName] || {
                    action: `Review and optimize operational guidelines regarding ${themeName.toLowerCase()}.`,
                    baseSeverity: "medium",
                };

                const insightText = `"${themeName}" is a recurring pattern reported in ${stats.count} recent volunteer responses (Average rating: ${avgRating}/5).`;
                const recommendedAction = kb.action;

                // Check if similar pending insight already exists to avoid duplicates
                const existingInsight = await AiInsight.findOne({
                    corporatePartnerId,
                    themeName,
                    status: "pending_review",
                });

                if (existingInsight) {
                    existingInsight.recurringCount = stats.count;
                    existingInsight.severity = severity;
                    existingInsight.insightText = insightText;
                    existingInsight.initialAverageRating = Number(avgRating);
                    await existingInsight.save();
                } else {
                    await AiInsight.create({
                        activityId,
                        corporatePartnerId,
                        themeName,
                        recurringCount: stats.count,
                        severity,
                        insightText,
                        recommendedAction,
                        initialAverageRating: Number(avgRating),
                        status: "pending_review",
                    });
                }
            }
        }

        // 4. Learning Loop: Update post-action effectiveness for past accepted recommendations
        await updateActionEffectiveness(corporatePartnerId);
    } catch (err) {
        console.error(`[AI Insight Engine] Error during pattern analysis for activity ${activityId}:`, err.message);
    }
};

/**
 * Closed-Loop AI Learning:
 * Evaluates whether implementing accepted AI recommendations improved volunteer ratings in subsequent events.
 */
export const updateActionEffectiveness = async (corporatePartnerId) => {
    try {
        const acceptedInsights = await AiInsight.find({
            corporatePartnerId,
            status: "accepted",
        });

        for (const insight of acceptedInsights) {
            // Fetch feedback submitted AFTER the insight review date
            const postActionFeedback = await Feedback.find({
                corporatePartnerId,
                submittedAt: { $gt: insight.reviewedAt || insight.updatedAt },
            }).lean();

            if (postActionFeedback.length >= 2) {
                const sum = postActionFeedback.reduce((acc, f) => acc + (f.overallRating || 0), 0);
                const postAvg = Number((sum / postActionFeedback.length).toFixed(1));
                insight.postActionAverageRating = postAvg;

                const initial = insight.initialAverageRating || 3.0;
                // Calculate percentage improvement score (0 to 100)
                const diff = postAvg - initial;
                const score = Math.min(100, Math.max(0, Math.round(50 + diff * 25)));
                insight.effectivenessScore = score;

                await insight.save();
            }
        }
    } catch (err) {
        console.error(`[AI Learning Loop] Error updating effectiveness score:`, err.message);
    }
};
