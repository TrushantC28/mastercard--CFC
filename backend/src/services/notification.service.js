import nodemailer from "nodemailer";

/**
 * Creates and returns a Nodemailer transporter instance using SMTP environment variables.
 */
const getTransporter = () => {
    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = Number(process.env.SMTP_PORT) || 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!user || !pass) {
        return null;
    }

    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
            user,
            pass,
        },
    });
};

/**
 * Helper to safely send email without throwing exceptions.
 */
const safeSendMail = async (mailOptions) => {
    try {
        const transporter = getTransporter();
        if (!transporter) {
            console.warn(`[Notification Module] SMTP credentials missing (SMTP_USER / SMTP_PASS). Skipped sending email to ${mailOptions.to}.`);
            return { success: false, reason: "SMTP credentials missing" };
        }

        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || '"Volunteer Platform" <no-reply@volunteerplatform.org>',
            ...mailOptions,
        });

        console.log(`[Notification Module] Email successfully sent to ${mailOptions.to}. MessageId: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error(`[Notification Module] Failed to send email to ${mailOptions.to}:`, error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Notifies a SPOC regarding an activity proposal decision (approved/rejected).
 * 
 * @param {Object} params
 * @param {string} params.spocEmail
 * @param {string} params.proposalTitle
 * @param {string} params.decision - "approved" | "rejected"
 * @param {string} [params.reviewNotes]
 */
export const notifyProposalDecision = async ({ spocEmail, proposalTitle, decision, reviewNotes }) => {
    if (!spocEmail) return { success: false, reason: "No spocEmail provided" };

    const subject = `[Volunteer Platform] Proposal Update: ${proposalTitle} - ${decision.toUpperCase()}`;
    const text = `Hello,\n\nYour proposal "${proposalTitle}" has been ${decision}.\n\nReview Notes: ${reviewNotes || "N/A"}\n\nBest regards,\nVolunteer Experience Platform Team`;
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2>Proposal Status Update</h2>
            <p>Your proposal <strong>${proposalTitle}</strong> has been <strong>${decision}</strong>.</p>
            <p><strong>Review Notes:</strong> ${reviewNotes || "None provided."}</p>
            <hr />
            <p style="font-size: 12px; color: #777;">Volunteer Experience Platform</p>
        </div>
    `;

    return await safeSendMail({
        to: spocEmail,
        subject,
        text,
        html,
    });
};

/**
 * Sends an upcoming activity reminder to a volunteer.
 * 
 * @param {Object} params
 * @param {string} params.volunteerEmail
 * @param {string} params.activityTitle
 * @param {string|Date} params.activityDate
 * @param {string} params.activityLocation
 */
export const notifyEventReminder = async ({ volunteerEmail, activityTitle, activityDate, activityLocation }) => {
    if (!volunteerEmail) return { success: false, reason: "No volunteerEmail provided" };

    const formattedDate = activityDate ? new Date(activityDate).toLocaleString() : "Upcoming";
    const subject = `[Reminder] Upcoming Activity: ${activityTitle}`;
    const text = `Hello,\n\nThis is a reminder for your upcoming activity "${activityTitle}".\nDate: ${formattedDate}\nLocation: ${activityLocation || "TBD"}\n\nThank you for volunteering!`;
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2>Activity Reminder</h2>
            <p>You are registered for <strong>${activityTitle}</strong>.</p>
            <p><strong>Date & Time:</strong> ${formattedDate}</p>
            <p><strong>Location:</strong> ${activityLocation || "TBD"}</p>
            <hr />
            <p style="font-size: 12px; color: #777;">Volunteer Experience Platform</p>
        </div>
    `;

    return await safeSendMail({
        to: volunteerEmail,
        subject,
        text,
        html,
    });
};

/**
 * Prompts a volunteer to submit feedback after attending an activity.
 * 
 * @param {Object} params
 * @param {string} params.volunteerEmail
 * @param {string} params.activityTitle
 * @param {string} params.activityId
 */
export const notifyFeedbackPrompt = async ({ volunteerEmail, activityTitle, activityId }) => {
    if (!volunteerEmail) return { success: false, reason: "No volunteerEmail provided" };

    const subject = `[Feedback Requested] How was your experience at "${activityTitle}"?`;
    const text = `Hello,\n\nThank you for participating in "${activityTitle}". Please share your feedback to help us improve!\n\nActivity ID: ${activityId}`;
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2>We value your feedback!</h2>
            <p>Thank you for attending <strong>${activityTitle}</strong>.</p>
            <p>Please take a moment to submit your ratings and feedback on the platform.</p>
            <hr />
            <p style="font-size: 12px; color: #777;">Volunteer Experience Platform</p>
        </div>
    `;

    return await safeSendMail({
        to: volunteerEmail,
        subject,
        text,
        html,
    });
};
