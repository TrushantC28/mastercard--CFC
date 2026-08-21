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

app.use(
    cors({
        origin: process.env.CORS_ORIGIN || "*",
        credentials: true,
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

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
