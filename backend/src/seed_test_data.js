import "dotenv/config";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import Activity from "./models/activity.model.js";
import EventRegistration from "./models/eventRegistration.model.js";
import CorporatePartner from "./models/corporatePartner.model.js";
import FeedbackTheme from "./models/feedbackTheme.model.js";
import Feedback from "./models/feedback.model.js";

const SECRET = process.env.ACCESS_TOKEN_SECRET || "11bce097163ea8162f6f81e1d97f3ba554c74b1e7023d9ec90c88b3e2b7658d517f4d86144bc013615ecbf285ffdef8351d1848c922bd40fc2282b010c1dd1c8";

async function seedData() {
    try {
        const uri = process.env.MONGODB_URI;
        await mongoose.connect(uri);
        console.log("Connected to DB for seeding test data...");

        // Fixed 24-char hex ObjectIds
        const partnerId = new mongoose.Types.ObjectId("66aa1111bb2222cc33333010");
        const volunteerId = new mongoose.Types.ObjectId("66aa1111bb2222cc33333001");
        const spocId = new mongoose.Types.ObjectId("66aa1111bb2222cc33333002");
        const adminId = new mongoose.Types.ObjectId("66aa1111bb2222cc33333003");

        const completedActivityId = new mongoose.Types.ObjectId("66aa1111bb2222cc33333030");
        const uncompletedActivityId = new mongoose.Types.ObjectId("66aa1111bb2222cc33333031");

        // 1. Corporate Partner
        await CorporatePartner.deleteOne({ _id: partnerId });
        await CorporatePartner.create({
            _id: partnerId,
            name: "Acme Corp",
            industry: "Technology",
            status: "active",
        });

        // 2. Users
        await User.deleteMany({
            $or: [
                { _id: { $in: [volunteerId, spocId, adminId] } },
                { email: { $in: ["priya.volunteer@example.com", "spoc@acmecorp.com", "admin@platform.com"] } },
            ],
        });
        await User.create([
            {
                _id: volunteerId,
                name: "Priya Sharma",
                email: "priya.volunteer@example.com",
                passwordHash: "$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
                role: "volunteer",
                status: "active",
            },
            {
                _id: spocId,
                name: "Rahul Mehta",
                email: "spoc@acmecorp.com",
                passwordHash: "$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
                role: "spoc",
                corporatePartnerId: partnerId,
                status: "active",
            },
            {
                _id: adminId,
                name: "Admin User",
                email: "admin@platform.com",
                passwordHash: "$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
                role: "admin",
                status: "active",
            },
        ]);

        // 3. Activities
        await Activity.deleteMany({ _id: { $in: [completedActivityId, uncompletedActivityId] } });
        await Activity.create([
            {
                _id: completedActivityId,
                title: "Weekend tree plantation drive",
                description: "Planting saplings at Aarey colony.",
                activityDate: new Date(),
                location: "Aarey Colony, Mumbai",
                corporatePartnerId: partnerId,
                createdByAdminId: adminId,
                volunteersRequired: 20,
                status: "completed",
            },
            {
                _id: uncompletedActivityId,
                title: "Beach Cleanup Drive",
                description: "Cleaning Versova beach.",
                activityDate: new Date(),
                location: "Versova Beach, Mumbai",
                corporatePartnerId: partnerId,
                createdByAdminId: adminId,
                volunteersRequired: 15,
                status: "open_for_signup",
            },
        ]);

        // 4. Registration (Attended for completed activity)
        await EventRegistration.deleteMany({ activityId: completedActivityId, volunteerId });
        await EventRegistration.create({
            activityId: completedActivityId,
            volunteerId,
            corporatePartnerId: partnerId,
            attendanceStatus: "attended",
        });

        // 5. Clean prior feedback for clean test
        await Feedback.deleteMany({ activityId: completedActivityId, volunteerId });

        // 6. Seed Themes
        await FeedbackTheme.deleteMany({ name: { $in: ["High impact felt", "Timing/logistics"] } });
        await FeedbackTheme.create([
            {
                name: "High impact felt",
                category: "positive",
                keywords: ["impact", "loved", "great", "organized"],
            },
            {
                name: "Timing/logistics",
                category: "negative",
                keywords: ["heat", "earlier", "delay", "timing"],
            },
        ]);

        // 7. Generate JWT Tokens
        const volunteerToken = jwt.sign(
            { _id: volunteerId.toString(), userId: volunteerId.toString(), role: "volunteer", corporatePartnerId: null },
            SECRET,
            { expiresIn: "1d" }
        );

        const spocToken = jwt.sign(
            { _id: spocId.toString(), userId: spocId.toString(), role: "spoc", corporatePartnerId: partnerId.toString() },
            SECRET,
            { expiresIn: "1d" }
        );

        const adminToken = jwt.sign(
            { _id: adminId.toString(), userId: adminId.toString(), role: "admin", corporatePartnerId: null },
            SECRET,
            { expiresIn: "1d" }
        );

        console.log("\n=======================================================");
        console.log("SEEDING COMPLETED! COPY-PASTE TOKENS & CURL COMMANDS BELOW:");
        console.log("=======================================================\n");

        console.log("VOLUNTEER_TOKEN:");
        console.log(volunteerToken);
        console.log("\nSPOC_TOKEN:");
        console.log(spocToken);
        console.log("\nADMIN_TOKEN:");
        console.log(adminToken);

        process.exit(0);
    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
}

seedData();
