import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        passwordHash: {
            type: String,
            required: true,
            select: false,
        },
        role: {
            type: String,
            required: true,
        },
        refreshToken: {
            type: String,
            select: false,
        },
    },
    {
        timestamps: true,
        collection: "users",
    },
);

const User = mongoose.model("User", userSchema);

export default User;