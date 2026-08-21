import Activity from "../models/activity.model.js";
import EventRegistration from "../models/eventRegistration.model.js";
import ApiError from "../utils/ApiError.js";

const canMarkRegistrationAttended = async (activityId) => {
    const activity = await Activity.findOne({
        _id: activityId,
        status: { $in: ["ongoing", "completed"] },
    })
        .select({ _id: 1 })
        .lean();

    return Boolean(activity);
};

const markRegistrationAttended = async (registrationId) => {
    const registration = await EventRegistration.findById(registrationId)
        .select({ activityId: 1 })
        .lean();

    if (!registration || !(await canMarkRegistrationAttended(registration.activityId))) {
        throw new ApiError(
            400,
            "A registration can be marked attended only while its activity is ongoing or completed",
        );
    }

    return EventRegistration.findByIdAndUpdate(
        registrationId,
        { attendanceStatus: "attended" },
        { new: true, runValidators: true },
    );
};

export { canMarkRegistrationAttended, markRegistrationAttended };