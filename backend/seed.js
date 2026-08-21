import "dotenv/config";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

import connectDB from "./config/db.js";
import User from "./src/models/User.js";
import CorporatePartner from "./src/models/corporatePartner.model.js";
import ActivityProposal from "./src/models/activityProposal.model.js";
import Activity from "./src/models/activity.model.js";
import EventRegistration from "./src/models/eventRegistration.model.js";
import FeedbackTheme from "./src/models/feedbackTheme.model.js";
import Feedback from "./src/models/feedback.model.js";

const seedPassword = process.env.SEED_PASSWORD || "SevaSahayog@2026";
const seedId = (number) => new mongoose.Types.ObjectId(number.toString(16).padStart(24, "0"));
const daysFromNow = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);

const upsertDocuments = async (Model, documents) => {
    await Promise.all(documents.map((document) => new Model(document).validate()));

    const result = await Model.bulkWrite(
        documents.map(({ _id, ...fields }) => ({
            updateOne: {
                filter: { _id },
                update: {
                    $set: fields,
                    $setOnInsert: { _id },
                },
                upsert: true,
            },
        })),
        { ordered: true },
    );

    return result.upsertedCount;
};

const buildUsers = async () => {
    const passwordHash = await bcrypt.hash(seedPassword, 12);
    const users = [];

    for (let index = 0; index < 5; index += 1) {
        users.push({
            _id: seedId(100 + index),
            name: ["Aarav Mehta", "Ishita Rao", "Kabir Shah", "Meera Nair", "Rohan Desai"][index],
            email: `admin${index + 1}@sevasahayog.example`,
            passwordHash,
            role: "admin",
            corporatePartnerId: null,
            refreshToken: null,
        });
    }

    const partnerIds = Array.from({ length: 5 }, (_, index) => seedId(200 + index));
    for (let index = 0; index < 5; index += 1) {
        users.push({
            _id: seedId(110 + index),
            name: ["Ananya Kulkarni", "Dev Malhotra", "Kavya Iyer", "Nikhil Joshi", "Sana Kapoor"][index],
            email: `spoc${index + 1}@sevasahayog.example`,
            passwordHash,
            role: "spoc",
            corporatePartnerId: partnerIds[index],
            refreshToken: null,
        });
    }

    for (let index = 0; index < 10; index += 1) {
        users.push({
            _id: seedId(120 + index),
            name: [
                "Aditi Bansal", "Arjun Pillai", "Bhavna Sethi", "Chirag Menon", "Diya Prasad",
                "Farhan Qureshi", "Gauri Sinha", "Harsh Vora", "Ira Thomas", "Jatin Rao",
            ][index],
            email: `volunteer${index + 1}@sevasahayog.example`,
            passwordHash,
            role: "volunteer",
            corporatePartnerId: null,
            refreshToken: null,
        });
    }

    return users;
};

const buildCorporatePartners = () => {
    const partners = [
        ["Green Horizon Foundation", "Environmental sustainability"],
        ["Udaan Learning Trust", "Education and skills"],
        ["Swasthya Setu Collective", "Community healthcare"],
        ["Nirmal Nagar Initiative", "Urban sanitation"],
        ["Saksham Livelihoods Network", "Employment and inclusion"],
    ];

    return partners.map(([name, industry], index) => ({
        _id: seedId(200 + index),
        name,
        industry,
        status: index === 4 ? "inactive" : "active",
    }));
};

const buildFeedbackThemes = () => {
    const themes = [
        ["Well organized", "positive"],
        ["Meaningful impact", "positive"],
        ["Helpful coordinators", "positive"],
        ["Schedule concerns", "negative"],
        ["Accessibility improvement", "urgent"],
        ["Community connection", "neutral"],
    ];

    return themes.map(([name, category], index) => ({
        _id: seedId(300 + index),
        name,
        category,
    }));
};

const buildActivityProposals = () => Array.from({ length: 12 }, (_, index) => ({
    _id: seedId(400 + index),
    corporatePartnerId: seedId(200 + (index % 5)),
    spocUserId: seedId(110 + (index % 5)),
    title: [
        "Riverbank restoration morning",
        "Digital literacy workshop",
        "Community health screening",
        "Neighborhood clean-up drive",
        "Career readiness clinic",
    ][index % 5],
    description: "A volunteer-led community activity planned with local coordinators.",
    proposedDate: daysFromNow(index - 12),
    volunteersRequired: 8 + (index % 5) * 2,
    status: index < 8 ? "approved" : index < 10 ? "pending" : "rejected",
    reviewedByAdminId: index < 8 || index >= 10 ? seedId(100 + (index % 5)) : null,
    reviewNotes: index < 8 ? "Approved for community calendar." : index >= 10 ? "Please revise the proposed scope." : null,
}));

const buildActivities = () => {
    const statuses = [
        "completed", "completed", "completed", "completed", "completed", "completed", "completed", "completed",
        "ongoing", "ongoing", "ongoing", "planned", "open_for_signup", "cancelled", "planned",
    ];

    return statuses.map((status, index) => ({
        _id: seedId(500 + index),
        title: [
            "Mangrove planting day", "After-school coding lab", "Nutrition awareness camp", "Waste segregation workshop",
            "Women entrepreneurs mentoring", "Lake clean-up morning", "First-aid readiness session", "School library refresh",
            "Urban garden setup", "Resume writing circle", "Community mapping walk", "Food distribution planning",
            "Inclusive sports afternoon", "Street mural project", "Financial literacy clinic",
        ][index],
        description: "A Seva Sahayog community activity coordinated with volunteers and a corporate partner.",
        activityDate: daysFromNow(index < 8 ? -20 + index : 8 + index),
        location: ["Pune", "Nashik", "Bengaluru", "Jaipur", "Ahmedabad"][index % 5],
        corporatePartnerId: seedId(200 + (index % 5)),
        createdByAdminId: seedId(100 + (index % 5)),
        sourceProposalId: index < 8 ? seedId(400 + index) : null,
        volunteersRequired: 10 + (index % 4) * 5,
        status,
    }));
};

const buildEventRegistrations = () => Array.from({ length: 30 }, (_, index) => {
    const activityIndex = Math.floor(index / 2);
    const volunteerIndex = index % 10;
    let attendanceStatus = "registered";

    if (activityIndex < 8) {
        attendanceStatus = volunteerIndex === 0 ? "attended" : "attended";
    } else if (activityIndex === 8) {
        attendanceStatus = "no_show";
    } else if (activityIndex === 9) {
        attendanceStatus = "cancelled";
    }

    return {
        _id: seedId(600 + index),
        activityId: seedId(500 + activityIndex),
        volunteerId: seedId(120 + volunteerIndex),
        corporatePartnerId: seedId(200 + (activityIndex % 5)),
        attendanceStatus,
        registeredAt: daysFromNow(-25 + index),
    };
});

const buildFeedback = () => Array.from({ length: 12 }, (_, index) => {
    const activityIndex = Math.floor(index / 2);
    const volunteerIndex = index % 2;

    return {
        _id: seedId(700 + index),
        activityId: seedId(500 + activityIndex),
        volunteerId: seedId(120 + volunteerIndex),
        corporatePartnerId: seedId(200 + (activityIndex % 5)),
        overallRating: 3 + (index % 3),
        organizationRating: 3 + (index % 3),
        impactRating: 4 + (index % 2),
        comments: "The activity was engaging and useful for the local community.",
        suggestions: index % 2 === 0 ? "Share the schedule a little earlier." : "Add a short volunteer briefing.",
        language: "en",
        themes: [
            {
                themeId: seedId(300 + (index % 3)),
                sentiment: "positive",
                confidenceScore: 0.82 + (index % 3) * 0.04,
            },
            {
                themeId: seedId(303 + (index % 3)),
                sentiment: index % 2 === 0 ? "negative" : "neutral",
                confidenceScore: 0.64 + (index % 3) * 0.05,
            },
        ],
        submittedAt: daysFromNow(-10 + index),
    };
});

const seed = async () => {
    await connectDB();

    const users = await buildUsers();
    const corporatePartners = buildCorporatePartners();
    const feedbackThemes = buildFeedbackThemes();
    const activityProposals = buildActivityProposals();
    const activities = buildActivities();
    const eventRegistrations = buildEventRegistrations();
    const feedback = buildFeedback();

    const created = {
        users: await upsertDocuments(User, users),
        corporatePartners: await upsertDocuments(CorporatePartner, corporatePartners),
        feedbackThemes: await upsertDocuments(FeedbackTheme, feedbackThemes),
        activityProposals: await upsertDocuments(ActivityProposal, activityProposals),
        activities: await upsertDocuments(Activity, activities),
        eventRegistrations: await upsertDocuments(EventRegistration, eventRegistrations),
        feedback: await upsertDocuments(Feedback, feedback),
    };

    console.log("Seed completed.");
    console.log("Documents inserted on this run:", created);
    console.log("Seed dataset total: 100 documents across 7 collections.");
    console.log("Local test password:", seedPassword);
};

seed()
    .catch((error) => {
        console.error("Seed failed:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.disconnect();
    });