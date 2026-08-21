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
const ACTIVITY_STATUSES = [
    "planned",
    "open_for_signup",
    "ongoing",
    "completed",
    "cancelled",
];

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

export const validateProposalDecision = (req, res, next) => {
    const { id } = req.params;
    const { reviewNotes } = req.body;
    const fields = {};

    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
        fields.id = "Must be a valid proposal ID.";
    }

    if (reviewNotes !== undefined && typeof reviewNotes !== "string") {
        fields.reviewNotes = "Must be a string.";
    }

    if (Object.keys(fields).length > 0) {
        const error = new ApiError(400, "Invalid proposal decision input.");
        error.fields = fields;
        error.code = "VALIDATION_ERROR";
        throw error;
    }

    next();
};

export const validateCreateActivity = (req, res, next) => {
    const {
        title,
        description,
        activityDate,
        location,
        corporatePartnerId,
        volunteersRequired,
    } = req.body;
    const fields = {};

    if (typeof title !== "string" || !title.trim()) {
        fields.title = "Title is required.";
    }

    if (!activityDate || Number.isNaN(new Date(activityDate).getTime())) {
        fields.activityDate = "Must be a valid date.";
    }

    if (!/^[a-fA-F0-9]{24}$/.test(corporatePartnerId || "")) {
        fields.corporatePartnerId = "Must be a valid corporate partner ID.";
    }

    if (!Number.isInteger(volunteersRequired) || volunteersRequired <= 0) {
        fields.volunteersRequired = "Must be a positive whole number.";
    }

    if (description !== undefined && typeof description !== "string") {
        fields.description = "Must be a string.";
    }

    if (location !== undefined && typeof location !== "string") {
        fields.location = "Must be a string.";
    }

    if (Object.keys(fields).length > 0) {
        const error = new ApiError(400, "Invalid activity input.");
        error.fields = fields;
        error.code = "VALIDATION_ERROR";
        throw error;
    }

    next();
};

export const validateActivityListQuery = (req, res, next) => {
    const { status, corporatePartnerId, dateFrom, dateTo } = req.query;
    const fields = {};

    if (status && !ACTIVITY_STATUSES.includes(status)) {
        fields.status = `Must be one of: ${ACTIVITY_STATUSES.join(", ")}.`;
    }

    if (
        corporatePartnerId &&
        !/^[a-fA-F0-9]{24}$/.test(corporatePartnerId)
    ) {
        fields.corporatePartnerId = "Must be a valid corporate partner ID.";
    }

    if (dateFrom && Number.isNaN(new Date(dateFrom).getTime())) {
        fields.dateFrom = "Must be a valid date.";
    }

    if (dateTo && Number.isNaN(new Date(dateTo).getTime())) {
        fields.dateTo = "Must be a valid date.";
    }

    if (
        dateFrom &&
        dateTo &&
        !fields.dateFrom &&
        !fields.dateTo &&
        new Date(dateFrom) > new Date(dateTo)
    ) {
        fields.dateTo = "Must be on or after dateFrom.";
    }

    if (Object.keys(fields).length > 0) {
        const error = new ApiError(400, "Invalid activity filter.");
        error.fields = fields;
        error.code = "VALIDATION_ERROR";
        throw error;
    }

    next();
};

export const validateActivityStatusUpdate = (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;
    const fields = {};

    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
        fields.id = "Must be a valid activity ID.";
    }

    if (!ACTIVITY_STATUSES.includes(status)) {
        fields.status = `Must be one of: ${ACTIVITY_STATUSES.join(", ")}.`;
    }

    if (Object.keys(fields).length > 0) {
        const error = new ApiError(400, "Invalid activity status input.");
        error.fields = fields;
        error.code = "VALIDATION_ERROR";
        throw error;
    }

    next();
};
