import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../db/index.js";
import CorporatePartner from "../models/corporatePartner.model.js";

const partnerData = {
    name: "Mastercard Test Partner",
    industry: "Financial Services",
    status: "active",
};

const createDummyCorporatePartner = async () => {
    try {
        await connectDB();

        const existingPartner = await CorporatePartner.findOne({
            name: partnerData.name,
        }).select("_id");

        if (existingPartner) {
            console.log("Corporate Partner already exists");
            console.log(`corporatePartnerId: ${existingPartner._id}`);
            return;
        }

        const corporatePartner = await CorporatePartner.create(partnerData);
        console.log("Corporate Partner created successfully");
        console.log(`corporatePartnerId: ${corporatePartner._id}`);
    } catch (error) {
        console.error("Failed to create dummy Corporate Partner:", error.message);
        process.exitCode = 1;
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    }
};

createDummyCorporatePartner();
