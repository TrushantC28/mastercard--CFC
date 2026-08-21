import ActivityProposal from "../models/activityProposal.model.js";

export const createProposal = async ({
    corporatePartnerId,
    spocUserId,
    title,
    description,
    proposedDate,
    volunteersRequired,
}) => {
    return await ActivityProposal.create({
        corporatePartnerId,
        spocUserId,
        title: title.trim(),
        description: description?.trim(),
        proposedDate,
        volunteersRequired,
    });
};

export const listProposals = async ({
    role,
    corporatePartnerId,
    status,
}) => {
    const filter = {};

    if (status) {
        filter.status = status;
    }

    if (role === "spoc" || corporatePartnerId) {
        filter.corporatePartnerId = corporatePartnerId;
    }

    return await ActivityProposal.find(filter)
        .sort({ createdAt: -1 })
        .populate("corporatePartnerId", "name")
        .populate("spocUserId", "name email")
        .lean();
};
