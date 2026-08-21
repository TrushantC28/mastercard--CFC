import rateLimit from "express-rate-limit";
import ApiError from "../utils/ApiError.js";

export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,                  // 20 requests per window for dev / testing flexibility
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
        next(new ApiError(options.statusCode || 429, "Too many requests, please try again later."));
    }
});
