import Feedback from "../models/feedback.model.js";
import FeedbackTheme from "../models/feedbackTheme.model.js";
import { notifyUrgentFeedbackAlert } from "./notification.service.js";

const URGENT_KEYWORDS = [
    "urgent", "emergency", "injury", "safety", "poisoning", "terrible", 
    "horrible", "kharaab", "खराब", "आपातकाल", "दुर्घटना", "असुरक्षित", "कचरा", "त्रास"
];

/**
 * Keyword / Rules-based matching function.
 * Evaluates combined text against theme keyword rules, supporting multilingual tokens (English, Hindi, Marathi).
 * 
 * @param {string} combinedText - Joined comments and suggestions text.
 * @param {Array} themesList - Array of FeedbackTheme documents with keywords.
 * @returns {Array} List of matched theme objects ready for feedback.themes array.
 */
export const classifyTextWithRules = (combinedText, themesList) => {
    const textLower = (combinedText || "").toLowerCase();
    const matchedThemes = [];

    for (const theme of themesList) {
        const keywords = Array.isArray(theme.keywords) && theme.keywords.length > 0
            ? theme.keywords
            : theme.name.toLowerCase().split(/\s+/).filter(w => w.length > 2);

        const isMatched = keywords.some((keyword) =>
            textLower.includes(keyword.toLowerCase().trim())
        );

        if (isMatched) {
            let sentiment = "positive";
            if (theme.category === "negative") {
                sentiment = "negative";
            } else if (theme.category === "neutral") {
                sentiment = "neutral";
            } else if (theme.category === "urgent") {
                sentiment = "negative";
            } else if (theme.category === "positive") {
                sentiment = "positive";
            }

            matchedThemes.push({
                themeId: theme._id,
                themeName: theme.name,
                sentiment,
                confidenceScore: 0.85,
            });
        }
    }

    return matchedThemes;
};

/**
 * Asynchronous, non-blocking classification runner.
 * Analyzes text, extracts themes, detects urgent concerns (rating <= 2 or urgent keywords),
 * updates feedback doc, and sends real-time admin alert if urgent.
 * 
 * @param {string|ObjectId} feedbackId 
 */
export const classifyFeedbackAsync = async (feedbackId) => {
    try {
        const feedback = await Feedback.findById(feedbackId)
            .populate("activityId", "title")
            .populate("volunteerId", "name email");

        if (!feedback) return;

        const textToAnalyze = `${feedback.comments || ""} ${feedback.suggestions || ""}`.trim();
        const textLower = textToAnalyze.toLowerCase();

        // 1. Check for urgent concern (rating <= 2 OR urgent keyword present)
        const hasUrgentKeyword = URGENT_KEYWORDS.some(kw => textLower.includes(kw));
        const isUrgent = feedback.overallRating <= 2 || hasUrgentKeyword;

        feedback.isUrgent = isUrgent;

        // 2. Fetch registered themes & classify
        const themesList = await FeedbackTheme.find({}).lean();
        if (themesList && themesList.length > 0 && textToAnalyze) {
            const matchedThemes = classifyTextWithRules(textToAnalyze, themesList);
            if (matchedThemes.length > 0) {
                feedback.themes = matchedThemes;
            }
        }

        await feedback.save();

        // 3. Trigger alert notification if urgent concern detected
        if (isUrgent) {
            const adminEmail = process.env.ADMIN_ALERT_EMAIL || "admin@sevasahayog.org";
            await notifyUrgentFeedbackAlert({
                adminEmail,
                activityTitle: feedback.activityId?.title || "Volunteering Activity",
                volunteerName: feedback.volunteerId?.name || "Volunteer",
                overallRating: feedback.overallRating,
                comments: feedback.comments,
            });
        }
    } catch (err) {
        console.error(`[Async Classification] Error processing feedback ${feedbackId}:`, err.message);
    }
};
