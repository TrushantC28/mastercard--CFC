import mongoose from "mongoose";

const eventRegistrationSchema = new mongoose.Schema(
    {
        activityId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Activity",
            required: true,
        },
        volunteerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        corporatePartnerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CorporatePartner",
            required: true,
        },
        attendanceStatus: {
            type: String,
            enum: ["registered", "attended", "no_show", "cancelled"],
            default: "registered",
            required: true,
        },
        registeredAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
        collection: "eventRegistrations",
    },
);

// Enforces one registration per volunteer for each activity at the DB level.
eventRegistrationSchema.index({ activityId: 1, volunteerId: 1 }, { unique: true });

// Supports a volunteer's "my activities" view.
eventRegistrationSchema.index({ volunteerId: 1 });

// Supports a SPOC's registered-volunteers view for an activity.
eventRegistrationSchema.index({ corporatePartnerId: 1, activityId: 1 });

const EventRegistration = mongoose.model("EventRegistration", eventRegistrationSchema);

export default EventRegistration;