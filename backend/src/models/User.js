/**
 * User model — owned by Backend 1 (Auth & User service).
 *
 * This stub satisfies the import in auth.middleware.js so Backend 2 can boot
 * and be tested independently. When Backend 1 lands their full User.js
 * (with bcrypt, JWT methods, refresh-token logic, etc.), replace this file
 * entirely with theirs — the schema shape here matches what the auth
 * middleware expects: _id, role, corporatePartnerId, status.
 */

import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        passwordHash: { type: String, required: true, select: false },
        phone: { type: String, trim: true },
        role: {
            type: String,
            enum: ["volunteer", "spoc", "admin"],
            required: true,
        },
        /**
         * Required for role=spoc, optional for role=volunteer, absent for role=admin.
         * Enforcement of the conditional rule is done at registration (Backend 1).
         */
        corporatePartnerId: {
            type: Schema.Types.ObjectId,
            ref: "CorporatePartner",
            default: null,
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
        refreshToken: { type: String, select: false },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
