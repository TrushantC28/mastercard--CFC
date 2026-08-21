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

const PROPOSAL_STATUSES = ["pending", "approved", "rejected"];

export const validateCreateProposal = (req, res, next) => {
    const { title, description, proposedDate, volunteersRequired } = req.body;
    const fields = {};

    if (typeof title !== "string" || !title.trim()) {
        fields.title = "Title is required.";
    }

    if (!proposedDate || Number.isNaN(new Date(proposedDate).getTime())) {
        fields.proposedDate = "Must be a valid date.";
    }

    if (
        !Number.isInteger(volunteersRequired) ||
        volunteersRequired <= 0
    ) {
        fields.volunteersRequired = "Must be a positive whole number.";
    }

    if (description !== undefined && typeof description !== "string") {
        fields.description = "Must be a string.";
    }

    if (Object.keys(fields).length > 0) {
        const error = new ApiError(400, "Invalid proposal input.");
        error.fields = fields;
        error.code = "VALIDATION_ERROR";
        throw error;
    }

    next();
};

export const validateProposalListQuery = (req, res, next) => {
    const { status } = req.query;

    if (status && !PROPOSAL_STATUSES.includes(status)) {
        const error = new ApiError(400, "Invalid proposal status filter.");
        error.fields = {
            status: `Must be one of: ${PROPOSAL_STATUSES.join(", ")}.`,
        };
        error.code = "VALIDATION_ERROR";
        throw error;
    }

    next();
};
