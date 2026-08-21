import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/error.middleware.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import proposalRouter from "./routes/proposal.routes.js";
import activityRouter from "./routes/activity.routes.js";
import registrationRouter from "./routes/registration.routes.js";
import feedbackRouter from "./routes/feedback.routes.js";
import aiInsightRouter from "./routes/aiInsight.routes.js";

const app = express();

// Configure CORS for production (Render <-> Vercel) and local development
const corsOrigin = process.env.CORS_ORIGIN
    ? (process.env.CORS_ORIGIN.includes(",")
        ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
        : (process.env.CORS_ORIGIN === "*" ? true : process.env.CORS_ORIGIN))
    : true;

app.use(
    cors({
        origin: corsOrigin,
        credentials: true,
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Health Check Endpoints (for Render & monitoring)
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.get("/api/v1/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// Register API Routes for both root and /api/v1 prefixes
const registerRoutes = (prefix = "") => {
    app.use(`${prefix}/auth`, authRouter);
    app.use(`${prefix}/users`, userRouter);
    app.use(`${prefix}/proposals`, proposalRouter);
    app.use(`${prefix}/activities`, activityRouter);
    app.use(`${prefix}`, registrationRouter);
    app.use(`${prefix}`, feedbackRouter);
    app.use(`${prefix}`, aiInsightRouter);
};

registerRoutes("");
registerRoutes("/api/v1");

// Global Error Handler
app.use(errorHandler);

export default app;
