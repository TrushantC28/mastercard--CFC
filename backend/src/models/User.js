import mongoose from "mongoose";
import bcrypt from "bcrypt";

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
            lowercase: true,
            trim: true,
        },
        passwordHash: {
            type: String,
            required: true,
            select: false,
        },
        name: {
            type: String,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
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
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
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

// Virtual for plain password handling
userSchema.virtual("password")
    .set(function (password) {
        this._password = password;
        this.passwordHash = password;
    })
    .get(function () {
        return this._password;
    });

// Pre-save hook: Hashes password before saving only if passwordHash was modified
userSchema.pre("save", async function (next) {
    if (!this.isModified("passwordHash")) {
        return next ? next() : undefined;
    }

    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);

    if (next) next();
});

// Instance method to verify password
userSchema.methods.comparePassword = async function (candidatePassword) {
    if (!candidatePassword || !this.passwordHash) {
        return false;
    }
    return await bcrypt.compare(candidatePassword, this.passwordHash);
};

// Supports filtering and querying users by role
userSchema.index({ role: 1 });

// Compound index for role and corporate partner scoping
userSchema.index({ role: 1, corporatePartnerId: 1 });

const User = mongoose.model("User", userSchema);

export default User;