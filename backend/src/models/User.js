import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        passwordHash: {
            type: String,
            required: true,
            select: false,
        },
        role: {
            type: String,
            required: true,
            enum: ["volunteer", "admin", "spoc"],
        },
        corporatePartnerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CorporatePartner",
            validate: {
                validator: function (value) {
                    if (this.role === "spoc") {
                        return Boolean(value);
                    }
                    if (this.role === "admin") {
                        return value == null;
                    }
                    // For volunteer: optional
                    return true;
                },
                message: "corporatePartnerId is required for spoc, optional for volunteer, and must be absent for admin.",
            },
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

// Supports filtering and querying users by role
userSchema.index({ role: 1 });

// Compound index for role and corporate partner scoping
userSchema.index({ role: 1, corporatePartnerId: 1 });

const User = mongoose.model("User", userSchema);

export default User;