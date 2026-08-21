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

// Helper to normalize origins (strips trailing slashes and whitespace)
const normalizeOrigin = (url) => (url ? url.trim().replace(/\/+$/, "") : "");

const rawCors = process.env.CORS_ORIGIN;
const configuredOrigins = rawCors
    ? rawCors.split(",").map((o) => normalizeOrigin(o)).filter(Boolean)
    : [];

// Robust CORS configuration supporting Vercel, localhost, and custom configured origins
app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps, curl, health probes)
            if (!origin) return callback(null, true);

            const cleanOrigin = normalizeOrigin(origin);

            // If no CORS_ORIGIN is specified or wildcard, dynamically reflect the origin
            if (!rawCors || rawCors === "*" || configuredOrigins.length === 0) {
                return callback(null, cleanOrigin);
            }

            // Check if matches configured origins (ignoring any trailing slash discrepancies)
            if (configuredOrigins.some((allowed) => allowed === cleanOrigin || allowed === "*")) {
                return callback(null, cleanOrigin);
            }

            // Automatically allow Vercel production and preview deployments
            if (cleanOrigin.endsWith(".vercel.app") || cleanOrigin.includes("localhost") || cleanOrigin.includes("127.0.0.1")) {
                return callback(null, cleanOrigin);
            }

            // Fallback: reflect clean origin to prevent browser CORS block
            return callback(null, cleanOrigin);
        },
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
