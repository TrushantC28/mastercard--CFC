import ApiError from "../utils/ApiError.js";

export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    let errorCode = "INTERNAL_ERROR";
    if (err.code && typeof err.code === "string") {
        errorCode = err.code;
    } else if (statusCode === 400) {
        errorCode = "BAD_REQUEST";
    } else if (statusCode === 401) {
        errorCode = "UNAUTHORIZED";
    } else if (statusCode === 403) {
        errorCode = "FORBIDDEN";
    } else if (statusCode === 404) {
        errorCode = "NOT_FOUND";
    } else if (statusCode === 409) {
        errorCode = "EMAIL_EXISTS";
    } else if (statusCode === 429) {
        errorCode = "TOO_MANY_REQUESTS";
    }

    const errorResponse = {
        success: false,
        error: { code: errorCode, message }
    };

    if (err.fields) {
        errorResponse.error.fields = err.fields;
    }

    return res.status(statusCode).json(errorResponse);
};
