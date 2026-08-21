import Activity from "../models/Activity.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Valid status transition map — only listed transitions are allowed
const VALID_TRANSITIONS = {
    planned: ["open_for_signup", "cancelled"],
    open_for_signup: ["ongoing", "cancelled"],
    ongoing: ["completed", "cancelled"],
    completed: [],
    cancelled: [],
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /activities — admin direct-creates an activity
// ─────────────────────────────────────────────────────────────────────────────
export const createActivity = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        activityDate,
        location,
        corporatePartnerId,
        volunteersRequired,
        sourceProposalId = null,
    } = req.body;

    if (!title || !description || !activityDate || !location || !corporatePartnerId || !volunteersRequired) {
        throw new ApiError(400, "One or more fields are invalid.");
    }

    const activity = await Activity.create({
        title,
        description,
        activityDate,
        location,
        corporatePartnerId,
        createdByAdminId: req.user._id,
        sourceProposalId,
        volunteersRequired,
        status: "planned",
    });

    return res
        .status(201)
        .json(new ApiResponse(201, formatActivity(activity), "Activity created."));
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /activities
//   volunteer → only open_for_signup / ongoing / completed
//   spoc      → auto-scoped to their corporatePartnerId (all statuses)
//   admin     → everything, optional filters: status, corporatePartnerId, dateFrom, dateTo
// ─────────────────────────────────────────────────────────────────────────────
export const getActivities = asyncHandler(async (req, res) => {
    const { status, corporatePartnerId, dateFrom, dateTo, page = 1, limit = 20 } = req.query;

    const filter = {};

    if (req.user.role === "volunteer") {
        filter.status = { $in: ["open_for_signup", "ongoing", "completed"] };
    } else if (req.user.role === "spoc") {
        // Server-side company scoping — never trust a client-supplied filter for SPOCs
        filter.corporatePartnerId = req.user.corporatePartnerId;
        if (status) filter.status = status;
    } else {
        // admin — full access with optional query filters
        if (status) filter.status = status;
        if (corporatePartnerId) filter.corporatePartnerId = corporatePartnerId;
    }

    if (dateFrom || dateTo) {
        filter.activityDate = {};
        if (dateFrom) filter.activityDate.$gte = new Date(dateFrom);
        if (dateTo) filter.activityDate.$lte = new Date(dateTo);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [activities, total] = await Promise.all([
        Activity.find(filter)
            .populate("corporatePartnerId", "name")
            .sort({ activityDate: 1 })
            .skip(skip)
            .limit(Number(limit)),
        Activity.countDocuments(filter),
    ]);

    // registeredCount is owned by Backend 3's eventRegistrations collection.
    // We expose it as 0 here; Backend 3 can populate it via a separate
    // aggregation or the frontend can combine calls as agreed in the API contract.
    const formatted = activities.map((a) => ({
        id: a._id,
        title: a.title,
        activityDate: a.activityDate,
        location: a.location,
        corporatePartnerId: a.corporatePartnerId?._id ?? a.corporatePartnerId,
        corporatePartnerName: a.corporatePartnerId?.name ?? null,
        volunteersRequired: a.volunteersRequired,
        registeredCount: 0, // populated by B3 aggregation in integration
        status: a.status,
        sourceProposalId: a.sourceProposalId,
        createdByAdminId: a.createdByAdminId,
        createdAt: a.createdAt,
    }));

    return res.status(200).json(
        new ApiResponse(200, {
            activities: formatted,
            page: Number(page),
            limit: Number(limit),
            total,
        })
    );
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /activities/:id — single activity detail (all authenticated roles)
// ─────────────────────────────────────────────────────────────────────────────
export const getActivityById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const activity = await Activity.findById(id).populate("corporatePartnerId", "name");
    if (!activity) throw new ApiError(404, "Activity not found.");

    // Enforce SPOC company scoping on single-record access too
    if (
        req.user.role === "spoc" &&
        activity.corporatePartnerId?._id?.toString() !== req.user.corporatePartnerId?.toString()
    ) {
        throw new ApiError(403, "You do not have permission to perform this action.");
    }

    return res.status(200).json(new ApiResponse(200, formatActivity(activity)));
});

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /activities/:id/status — admin transitions activity status
// Enforces valid transition map: e.g. planned → completed is rejected
// ─────────────────────────────────────────────────────────────────────────────
export const updateActivityStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status: newStatus } = req.body;

    if (!newStatus) {
        throw new ApiError(400, "One or more fields are invalid.", [], {
            fields: { status: "Status is required." },
        });
    }

    const activity = await Activity.findById(id);
    if (!activity) throw new ApiError(404, "Activity not found.");

    const currentStatus = activity.status;
    const allowedNext = VALID_TRANSITIONS[currentStatus] ?? [];

    if (!allowedNext.includes(newStatus)) {
        throw new ApiError(
            400,
            `Cannot move an activity from '${currentStatus}' directly to '${newStatus}'.`,
            [],
            { code: "invalid_transition" }
        );
    }

    activity.status = newStatus;
    await activity.save();

    return res.status(200).json(
        new ApiResponse(200, {
            id: activity._id,
            status: activity.status,
            updatedAt: activity.updatedAt,
        }, "Activity status updated.")
    );
});

// ─────────────────────────────────────────────────────────────────────────────
// Internal helper
// ─────────────────────────────────────────────────────────────────────────────
function formatActivity(a) {
    return {
        id: a._id,
        title: a.title,
        description: a.description,
        activityDate: a.activityDate,
        location: a.location,
        corporatePartnerId: a.corporatePartnerId?._id ?? a.corporatePartnerId,
        corporatePartnerName: a.corporatePartnerId?.name ?? null,
        createdByAdminId: a.createdByAdminId,
        sourceProposalId: a.sourceProposalId,
        volunteersRequired: a.volunteersRequired,
        status: a.status,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
    };
}
