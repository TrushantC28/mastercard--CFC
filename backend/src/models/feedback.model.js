import mongoose from "mongoose";

const feedbackThemeTagSchema = new mongoose.Schema({
    themeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FeedbackTheme",
        required: true,
    },
    themeName: {
        type: String,
    },
    sentiment: {
        type: String,
        enum: ["positive", "neutral", "negative"],
        required: true,
    },
    confidenceScore: {
        type: Number,
        min: 0,
        max: 1,
    },
});

const feedbackSchema = new mongoose.Schema(
    {
        activityId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Activity",
            required: true,
        },
        volunteerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        corporatePartnerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CorporatePartner",
            required: true,
        },
        overallRating: {
            type: Number,
            min: 1,
            max: 5,
            required: true,
        },
        organizationRating: {
            type: Number,
            min: 1,
            max: 5,
        },
        impactRating: {
            type: Number,
            min: 1,
            max: 5,
        },
        comments: {
            type: String,
        },
        suggestions: {
            type: String,
        },
        language: {
            type: String,
            default: "en",
        },
        themes: {
            type: [feedbackThemeTagSchema],
        },
        submittedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
        collection: "feedback",
    },
);

// Enforces one feedback document per volunteer for each activity at the DB level.
feedbackSchema.index({ activityId: 1, volunteerId: 1 }, { unique: true });

// Supports SPOC reports filtered and sorted by submission date within a company.
feedbackSchema.index({ corporatePartnerId: 1, submittedAt: 1 });

// Supports cross-activity theme-frequency aggregation for admins.
feedbackSchema.index({ "themes.themeId": 1 });

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;