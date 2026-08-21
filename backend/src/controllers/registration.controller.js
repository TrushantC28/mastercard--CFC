import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import Activity from "../models/activity.model.js";
import EventRegistration from "../models/eventRegistration.model.js";
import { canMarkAttended } from "../services/attendanceEligibility.js";

const sendError = (res, statusCode, error, message, fields) => {
    const payload = { error, message };

    if (fields) {
        payload.fields = fields;
    }

    return res.status(statusCode).json(payload);
};

const isValidId = (id) => mongoose.isObjectIdOrHexString(id);

const sameId = (first, second) =>
    first != null && second != null && first.toString() === second.toString();

const toIsoString = (value) => (value ? new Date(value).toISOString() : null);

const toDateOnly = (value) => (value ? new Date(value).toISOString().slice(0, 10) : null);

export const registerForActivity = asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) {
        return sendError(res, 404, "not_found", "Activity not found.");
    }

    const activity = await Activity.findById(req.params.id).lean();

    if (!activity) {
        return sendError(res, 404, "not_found", "Activity not found.");
    }

    if (activity.status !== "open_for_signup") {
        return sendError(
            res,
            400,
            "invalid_state",
            "Activity is not open for registration."
        );
    }

    try {
        const registration = await EventRegistration.create({
            activityId: activity._id,
            volunteerId: req.user._id,
            corporatePartnerId: activity.corporatePartnerId,
        });

        return res.status(201).json({
            id: registration._id.toString(),
            activityId: registration.activityId.toString(),
            volunteerId: registration.volunteerId.toString(),
            corporatePartnerId: registration.corporatePartnerId.toString(),
            attendanceStatus: registration.attendanceStatus,
            registeredAt: toIsoString(registration.registeredAt),
        });
    } catch (error) {
        if (error?.code === 11000) {
            return sendError(
                res,
                409,
                "conflict",
                "You have already registered for this activity."
            );
        }

        throw error;
    }
});

export const markAttendance = asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) {
        return sendError(res, 404, "not_found", "Registration not found.");
    }

    const { attendanceStatus } = req.body;
    if (!["attended", "no_show"].includes(attendanceStatus)) {
        return sendError(
            res,
            400,
            "validation_error",
            "One or more fields are invalid.",
            {
                attendanceStatus: "Must be either attended or no_show.",
            }
        );
    }

    const registration = await EventRegistration.findById(req.params.id);
    if (!registration) {
        return sendError(res, 404, "not_found", "Registration not found.");
    }

    if (!(await canMarkAttended(registration.activityId))) {
        return sendError(
            res,
            400,
            "invalid_state",
            "Cannot mark attendance before the activity has started."
        );
    }

    registration.attendanceStatus = attendanceStatus;
    await registration.save();

    return res.status(200).json({
        id: registration._id.toString(),
        attendanceStatus: registration.attendanceStatus,
        updatedAt: toIsoString(registration.updatedAt),
    });
});

export const getActivityRegistrations = asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) {
        return sendError(res, 404, "not_found", "Activity not found.");
    }

    const activity = await Activity.findById(req.params.id)
        .select({ corporatePartnerId: 1, volunteersRequired: 1 })
        .lean();

    if (!activity) {
        return sendError(res, 404, "not_found", "Activity not found.");
    }

    if (
        req.user.role === "spoc" &&
        !sameId(activity.corporatePartnerId, req.user.corporatePartnerId)
    ) {
        return sendError(
            res,
            403,
            "forbidden",
            "You do not have permission to perform this action."
        );
    }

    const registrations = await EventRegistration.find({ activityId: activity._id })
        .populate({ path: "volunteerId", select: "name" })
        .sort({ registeredAt: 1 })
        .lean();

    return res.status(200).json({
        activityId: activity._id.toString(),
        volunteersRequired: activity.volunteersRequired,
        registrations: registrations.map((registration) => ({
            id: registration._id.toString(),
            volunteerId: registration.volunteerId?._id
                ? registration.volunteerId._id.toString()
                : registration.volunteerId?.toString(),
            volunteerName: registration.volunteerId?.name || null,
            attendanceStatus: registration.attendanceStatus,
            registeredAt: toIsoString(registration.registeredAt),
        })),
        registeredCount: registrations.length,
    });
});

export const getMyRegistrations = asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) {
        return sendError(res, 403, "forbidden", "You do not have permission to perform this action.");
    }

    if (req.user.role === "volunteer" && !sameId(req.user._id, req.params.id)) {
        return sendError(
            res,
            403,
            "forbidden",
            "You do not have permission to perform this action."
        );
    }

    const registrations = await EventRegistration.find({ volunteerId: req.params.id })
        .populate({ path: "activityId", select: "title activityDate" })
        .sort({ registeredAt: -1 })
        .lean();

    return res.status(200).json({
        registrations: registrations.map((registration) => ({
            id: registration._id.toString(),
            activityId: registration.activityId?._id
                ? registration.activityId._id.toString()
                : registration.activityId?.toString(),
            activityTitle: registration.activityId?.title || null,
            activityDate: toDateOnly(registration.activityId?.activityDate),
            attendanceStatus: registration.attendanceStatus,
        })),
    });
});
