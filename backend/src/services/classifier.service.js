import Feedback from "../models/feedback.model.js";
import FeedbackTheme from "../models/feedbackTheme.model.js";

/**
 * Keyword / Rules-based matching function.
 * Evaluates combined text against theme keyword rules.
 * Modular design: This function signature (combinedText, themesList) can easily be swapped 
 * or wrapped with an LLM call (e.g. OpenAI / Gemini) in the future.
 * 
 * @param {string} combinedText - Joined comments and suggestions text.
 * @param {Array} themesList - Array of FeedbackTheme documents with keywords.
 * @returns {Array} List of matched theme objects ready for feedback.themes array.
 */
export const classifyTextWithRules = (combinedText, themesList) => {
    const textLower = (combinedText || "").toLowerCase();
    const matchedThemes = [];

    for (const theme of themesList) {
        // Collect keywords from theme.keywords or split theme.name into word tokens as fallback
        const keywords = Array.isArray(theme.keywords) && theme.keywords.length > 0
            ? theme.keywords
            : theme.name.toLowerCase().split(/\s+/).filter(w => w.length > 2);

        // Check if any keyword matches the text
        const isMatched = keywords.some((keyword) =>
            textLower.includes(keyword.toLowerCase().trim())
        );

        if (isMatched) {
            // Determine sentiment: map category "urgent" or "neutral" or fallback to category/positive
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
 * Fetches feedback doc & themes, runs matching, and updates feedback doc.
 * Call this without 'await' in controllers so it doesn't block HTTP responses.
 * 
 * @param {string|ObjectId} feedbackId 
 */
export const classifyFeedbackAsync = async (feedbackId) => {
    try {
        const feedback = await Feedback.findById(feedbackId);
        if (!feedback) return;

        const textToAnalyze = `${feedback.comments || ""} ${feedback.suggestions || ""}`.trim();
        if (!textToAnalyze) return;

        // Fetch registered themes from DB
        const themesList = await FeedbackTheme.find({}).lean();
        if (!themesList || themesList.length === 0) return;

        const matchedThemes = classifyTextWithRules(textToAnalyze, themesList);

        if (matchedThemes.length > 0) {
            feedback.themes = matchedThemes;
            await feedback.save();
        }
    } catch (err) {
        console.error(`[Async Classification] Error processing feedback ${feedbackId}:`, err.message);
    }
};
