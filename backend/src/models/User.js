import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
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
        corporatePartnerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CorporatePartner",
            default: null,
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