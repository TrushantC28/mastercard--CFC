import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import ApiResponse from "./utils/ApiResponse.js";
import { errorHandler } from "./middleware/error.middleware.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import proposalRouter from "./routes/proposal.routes.js";
import activityRouter from "./routes/activity.routes.js";
import registrationRouter from "./routes/registration.routes.js";
import feedbackRouter from "./routes/feedback.routes.js";
import aiInsightRouter from "./routes/aiInsight.routes.js";

const app = express();

const rawCorsOrigin = process.env.CORS_ORIGIN;
const configuredOrigins = rawCorsOrigin && rawCorsOrigin !== "*"
    ? rawCorsOrigin.split(",").map((o) => o.trim().replace(/\/+$/, "").replace(/^https?:\/\/https?:\/\//, "https://"))
    : [];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true); // Allow mobile, curl, server-to-server

            const cleanOrigin = origin.trim().replace(/\/+$/, "");

            if (!rawCorsOrigin || rawCorsOrigin === "*") {
                return callback(null, true);
            }

            const isAllowed = configuredOrigins.some((allowed) => {
                const cleanAllowed = allowed.replace(/\/+$/, "");
                return cleanOrigin === cleanAllowed || cleanAllowed === "*";
            }) || cleanOrigin.endsWith(".vercel.app") || cleanOrigin.includes("localhost");

            if (isAllowed) {
                callback(null, true);
            } else {
                callback(new Error(`CORS error: Origin ${origin} not allowed`));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Health check endpoints for Render
app.get("/", (req, res) => {
    return res.status(200).json(new ApiResponse(200, {}, "Mastercard CFC API is running"));
});

app.get("/health", (req, res) => {
    return res.status(200).json(new ApiResponse(200, { status: "OK" }, "Health check passed"));
});

// Routes
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/proposals", proposalRouter);
app.use("/activities", activityRouter);
app.use("/", registrationRouter);
app.use("/", feedbackRouter);
app.use("/", aiInsightRouter);

// Global Error Handler
app.use(errorHandler);

export default app;
