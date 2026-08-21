import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

export const registerUser = async ({
    email,
    password,
    name,
    phone,
    role,
    corporatePartnerId,
}) => {
    const trimmedEmail = email ? email.toLowerCase().trim() : "";

    if (!trimmedEmail) {
        throw new ApiError(400, "Email is required");
    }

    if (!password) {
        throw new ApiError(400, "Password is required");
    }

    if (!role) {
        throw new ApiError(400, "Role is required");
    }

    if (!["volunteer", "admin", "spoc"].includes(role)) {
        throw new ApiError(400, "Role must be one of: volunteer, admin, spoc");
    }

    // Role-based validation for corporatePartnerId
    if (role === "spoc" && !corporatePartnerId) {
        throw new ApiError(400, "corporatePartnerId is required for spoc role");
    }

    if (role === "admin" && corporatePartnerId) {
        throw new ApiError(400, "corporatePartnerId must be absent for admin role");
    }

    if (corporatePartnerId && !mongoose.Types.ObjectId.isValid(corporatePartnerId)) {
        throw new ApiError(400, "Invalid corporatePartnerId format. Must be a 24-character hex string.");
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: trimmedEmail });
    if (existingUser) {
        const error = new ApiError(400, "Email already registered");
        error.code = "EMAIL_EXISTS";
        throw error;
    }

    try {
        const user = await User.create({
            email: trimmedEmail,
            password,
            name: name?.trim(),
            phone: phone?.trim(),
            role,
            corporatePartnerId: corporatePartnerId || null,
        });

        const userObject = user.toObject();
        delete userObject.passwordHash;
        delete userObject.refreshToken;
        userObject.id = userObject._id.toString();

        return userObject;
    } catch (err) {
        if (err.code === 11000) {
            const error = new ApiError(400, "Email already registered");
            error.code = "EMAIL_EXISTS";
            throw error;
        }
        if (err.name === "CastError") {
            throw new ApiError(400, `Invalid format for ${err.path}: ${err.value}`);
        }
        if (err.name === "ValidationError") {
            throw new ApiError(400, err.message);
        }
        throw err;
    }
};

export const loginUser = async ({ email, password }) => {
    const trimmedEmail = email ? email.toLowerCase().trim() : "";

    if (!trimmedEmail || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email: trimmedEmail }).select("+passwordHash");

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password");
    }

    const payload = {
        _id: user._id,
        userId: user._id.toString(),
        role: user.role,
        corporatePartnerId: user.corporatePartnerId || null,
    };

    const token = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET || "access_token_secret_key",
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d",
        }
    );

    const safeUser = {
        id: user._id.toString(),
        _id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        corporatePartnerId: user.corporatePartnerId || null,
        status: user.status,
    };

    return {
        token,
        user: safeUser,
    };
};
