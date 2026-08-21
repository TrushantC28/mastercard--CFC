import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
    createActivity as createActivityRecord,
    listActivities as listActivityRecords,
    updateActivityStatus as updateActivityStatusRecord,
} from "../services/activity.service.js";

export const createActivity = asyncHandler(async (req, res) => {
    const adminId = req.user?._id || req.user?.userId;

    const activity = await createActivityRecord({
        title: req.body.title,
        description: req.body.description,
        activityDate: req.body.activityDate,
        location: req.body.location,
        corporatePartnerId: req.body.corporatePartnerId,
        volunteersRequired: req.body.volunteersRequired,
        adminId,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, activity, "Activity created successfully"));
});

export const getActivities = asyncHandler(async (req, res) => {
    const { role, corporatePartnerId } = req.user;
    const { status, dateFrom, dateTo } = req.query;

    if (role === "spoc" && req.query.corporatePartnerId) {
        throw new ApiError(
            403,
            "SPOC activity access is always limited to the authenticated company."
        );
    }

    if (role === "volunteer" && req.query.corporatePartnerId) {
        throw new ApiError(403, "Only admins may filter activities by company.");
    }

    if (role === "spoc" && !corporatePartnerId) {
        throw new ApiError(403, "A SPOC corporate partner is required.");
    }

    const activities = await listActivityRecords({
        corporatePartnerId:
            role === "spoc" ? corporatePartnerId : req.query.corporatePartnerId,
        status,
        dateFrom,
        dateTo,
        visibleStatuses:
            role === "volunteer"
                ? ["open_for_signup", "ongoing", "completed"]
                : undefined,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, activities, "Activities fetched successfully"));
});

export const updateActivityStatus = asyncHandler(async (req, res) => {
    const activity = await updateActivityStatusRecord({
        activityId: req.params.id,
        status: req.body.status,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, activity, "Activity status updated successfully"));
});
