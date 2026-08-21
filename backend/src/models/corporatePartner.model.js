import mongoose from "mongoose";

const corporatePartnerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            // Enforces one record per company, used when a SPOC or admin looks up a company by name.
            unique: true,
        },
        industry: {
            type: String,
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
    },
    {
        timestamps: true,
        collection: "corporatePartners",
    },
);

const CorporatePartner = mongoose.model("CorporatePartner", corporatePartnerSchema);

export default CorporatePartner;