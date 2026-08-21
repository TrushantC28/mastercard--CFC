import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/error.middleware.js";

// ── Route imports ──────────────────────────────────────────────────────────
// Backend 2 owns these two routers.
// Backend 1 will export authRouter and userRouter; uncomment when available.
import proposalRouter from "./routes/proposal.routes.js";
import activityRouter from "./routes/activity.routes.js";
// import authRouter from "./routes/auth.routes.js";     // Backend 1
// import userRouter from "./routes/user.routes.js";     // Backend 1

const app = express();

// ── Core middleware ────────────────────────────────────────────────────────
app.use(
    cors({
        origin: process.env.CORS_ORIGIN || "*",
        credentials: true,
    })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// ── Health check ───────────────────────────────────────────────────────────
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// ── Auth & User routes (Backend 1) ─────────────────────────────────────────
// app.use("/api/v1/auth",  authRouter);
// app.use("/api/v1/users", userRouter);

// ── Backend 2 routes ───────────────────────────────────────────────────────
app.use("/api/v1/proposals",  proposalRouter);
app.use("/api/v1/activities", activityRouter);

// ── Global error handler (must be last) ───────────────────────────────────
app.use(errorHandler);

export default app;
