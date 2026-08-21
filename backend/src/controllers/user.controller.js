import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { getUserProfile, listUsers } from "../services/user.service.js";

export const getCurrentUser = asyncHandler(async (req, res) => {
    const userId = req.user?._id || req.user?.userId;
    const user = await getUserProfile(userId);

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User profile fetched successfully"));
});

export const getUsers = asyncHandler(async (req, res) => {
    const { role, corporatePartnerId, page, limit } = req.query;

    const result = await listUsers({
        role,
        corporatePartnerId,
        page,
        limit,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, result, "Users fetched successfully"));
});
