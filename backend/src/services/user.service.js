import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

export const getUserProfile = async (userId) => {
    const user = await User.findById(userId)
        .select("-passwordHash -refreshToken")
        .lean();

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return {
        id: user._id.toString(),
        ...user,
    };
};

export const listUsers = async ({
    role,
    corporatePartnerId,
    page = 1,
    limit = 20,
}) => {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (role) {
        filter.role = role;
    }
    if (corporatePartnerId) {
        filter.corporatePartnerId = corporatePartnerId;
    }

    const [users, total] = await Promise.all([
        User.find(filter)
            .select("-passwordHash -refreshToken")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .lean(),
        User.countDocuments(filter),
    ]);

    const formattedUsers = users.map((user) => ({
        id: user._id.toString(),
        ...user,
    }));

    return {
        users: formattedUsers,
        page: pageNum,
        limit: limitNum,
        total,
    };
};
