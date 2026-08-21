import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * Middleware: Verifies the JWT from the Authorization header (or cookie)
 * and attaches the decoded payload to req.user.
 * Returns 401 if missing, invalid, or expired.
 */
export const requireAuth = asyncHandler(async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        const token =
            req.cookies?.accessToken ||
            (authHeader && authHeader.startsWith("Bearer ")
                ? authHeader.replace("Bearer ", "")
                : authHeader);

        if (!token) {
            throw new ApiError(401, "Authentication required.");
        }

        const decodedToken = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET || "access_token_secret_key"
        );

        req.user = {
            _id: decodedToken._id || decodedToken.userId,
            userId: decodedToken.userId || decodedToken._id,
            role: decodedToken.role,
            corporatePartnerId: decodedToken.corporatePartnerId || null,
            ...decodedToken,
        };

        next();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        if (error.name === "TokenExpiredError") {
            throw new ApiError(401, "Token has expired. Authentication required.");
        }
        if (error.name === "JsonWebTokenError") {
            throw new ApiError(401, "Invalid token. Authentication required.");
        }
        throw new ApiError(401, error?.message || "Authentication required.");
    }
});

/**
 * Middleware Factory: Enforces role-based access control.
 * Runs after requireAuth and returns 403 if req.user.role is not in allowedRoles.
 */
export const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            throw new ApiError(401, "Authentication required.");
        }

        if (!allowedRoles.includes(req.user.role)) {
            const error = new ApiError(
                403,
                "You do not have permission to perform this action."
            );
            error.code = "FORBIDDEN";
            throw error;
        }

        next();
    };
};

// Backwards compatibility alias
export const verifyJWT = requireAuth;

