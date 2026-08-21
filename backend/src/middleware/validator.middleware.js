import ApiError from "../utils/ApiError.js";

export const validateSignupOrLogin = (req, res, next) => {
    const { email, password } = req.body;
    const fields = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        fields.email = "Must be a valid email address.";
    }

    if (!password || password.length < 8) {
        fields.password = "Must be at least 8 characters.";
    }

    if (Object.keys(fields).length > 0) {
        const error = new ApiError(400, "Invalid input.");
        error.fields = fields;
        error.code = "VALIDATION_ERROR";
        throw error;
    }

    next();
};
