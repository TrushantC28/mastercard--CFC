import mongoose from "mongoose";

const feedbackThemeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            // Enforces one controlled-vocabulary entry per theme name.
            unique: true,
        },
        category: {
            type: String,
            enum: ["positive", "negative", "neutral", "urgent"],
            required: true,
        },
        keywords: [
            {
                type: String,
            },
        ],
    },
    {
        collection: "feedbackThemes",
    },
);

const FeedbackTheme = mongoose.model("FeedbackTheme", feedbackThemeSchema);

export default FeedbackTheme;