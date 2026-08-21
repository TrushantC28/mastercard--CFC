import Activity from "../models/activity.model.js";
import "../models/corporatePartner.model.js";
import ApiError from "../utils/ApiError.js";

export const ACTIVITY_STATUS_TRANSITIONS = {
    planned: ["open_for_signup", "cancelled"],
    open_for_signup: ["ongoing", "cancelled"],
    ongoing: ["completed", "cancelled"],
    completed: [],
    cancelled: [],
};

export const createActivity = async ({
    title,
    description,
    activityDate,
    location,
    corporatePartnerId,
    volunteersRequired,
    adminId,
}) => {
    return await Activity.create({
        title: title.trim(),
        description: description?.trim(),
        activityDate,
        location: location?.trim(),
        corporatePartnerId,
        createdByAdminId: adminId,
        volunteersRequired,
        sourceProposalId: null,
        status: "planned",
    });
};

export const listActivities = async ({
    corporatePartnerId,
    status,
    dateFrom,
    dateTo,
    visibleStatuses,
}) => {
    const filter = {};

    if (corporatePartnerId) {
        filter.corporatePartnerId = corporatePartnerId;
    }

    if (visibleStatuses) {
        filter.status = status
            ? { $eq: status, $in: visibleStatuses }
            : { $in: visibleStatuses };
    } else if (status) {
        filter.status = status;
    }

    if (dateFrom || dateTo) {
        filter.activityDate = {};
        if (dateFrom) {
            filter.activityDate.$gte = new Date(dateFrom);
        }
        if (dateTo) {
            filter.activityDate.$lte = new Date(dateTo);
        }
    }

    return await Activity.find(filter)
        .sort({ activityDate: 1 })
        .populate("corporatePartnerId", "name")
        .lean();
};

export const updateActivityStatus = async ({ activityId, status }) => {
    const activity = await Activity.findById(activityId);

    if (!activity) {
        throw new ApiError(404, "Activity not found.");
    }

    if (activity.status === status) {
        const error = new ApiError(400, "Activity is already in this status.");
        error.code = "INVALID_ACTIVITY_STATUS_TRANSITION";
        throw error;
    }

    if (!ACTIVITY_STATUS_TRANSITIONS[activity.status].includes(status)) {
        const error = new ApiError(
            400,
            `Cannot move an activity from '${activity.status}' to '${status}'.`
        );
        error.code = "INVALID_ACTIVITY_STATUS_TRANSITION";
        throw error;
    }

    const updatedActivity = await Activity.findOneAndUpdate(
        { _id: activityId, status: activity.status },
        { $set: { status } },
        { new: true, runValidators: true }
    );

    if (updatedActivity) {
        return updatedActivity;
    }

    throw new ApiError(
        409,
        "Activity status changed before this update could be applied."
    );
};
