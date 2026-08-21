import Activity from "../models/activity.model.js";
import EventRegistration from "../models/eventRegistration.model.js";
import Feedback from "../models/feedback.model.js";
import ApiError from "../utils/ApiError.js";

const canSubmitFeedback = async (activityId, volunteerId) => {
    const [activity, registration] = await Promise.all([
        Activity.findOne({ _id: activityId, status: "completed" })
            .select({ _id: 1 })
            .lean(),
        EventRegistration.findOne({
            activityId,
            volunteerId,
            attendanceStatus: "attended",
        })
            .select({ _id: 1 })
            .lean(),
    ]);

    return Boolean(activity && registration);
};

const assertCanSubmitFeedback = async (activityId, volunteerId) => {
    if (!(await canSubmitFeedback(activityId, volunteerId))) {
        throw new ApiError(
            400,
            "Feedback requires a completed activity and attended registration",
        );
    }
};

const createFeedback = async (feedbackData) => {
    await assertCanSubmitFeedback(feedbackData.activityId, feedbackData.volunteerId);
    return Feedback.create(feedbackData);
};

export { canSubmitFeedback, assertCanSubmitFeedback, createFeedback };