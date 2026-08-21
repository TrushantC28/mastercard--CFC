import Activity from "../models/activity.model.js";

const canMarkAttended = async (activityId) => {
    const activity = await Activity.findOne({
        _id: activityId,
        status: { $in: ["ongoing", "completed"] },
    })
        .select({ _id: 1 })
        .lean();

    return Boolean(activity);
};

export { canMarkAttended };
