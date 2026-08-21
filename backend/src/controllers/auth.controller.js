import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { registerUser, loginUser } from "../services/auth.service.js";

export const register = asyncHandler(async (req, res) => {
    const { email, password, name, phone, role, corporatePartnerId } = req.body;

    const createdUser = await registerUser({
        email,
        password,
        name,
        phone,
        role,
        corporatePartnerId,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const authData = await loginUser({ email, password });

    return res
        .status(200)
        .json(new ApiResponse(200, authData, "User logged in successfully"));
});

export const logout = asyncHandler(async (req, res) => {
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "Logged out successfully."));
});
