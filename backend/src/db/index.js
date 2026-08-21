import mongoose from "mongoose";

const DB_NAME = process.env.DB_NAME || "mastercard_cfc";

const connectDB = async () => {
    try {
        let uri = process.env.MONGODB_URI;
        if (!uri) {
            console.error("⚠️ MONGODB_URI is not set in environment variables!");
            throw new Error("MONGODB_URI environment variable is missing");
        }

        if (!uri.includes(DB_NAME)) {
            if (uri.includes("?")) {
                uri = uri.replace(/\/?\?/, `/${DB_NAME}?`);
            } else {
                uri = uri.endsWith("/") ? `${uri}${DB_NAME}` : `${uri}/${DB_NAME}`;
            }
        }

        const connectionInstance = await mongoose.connect(uri);
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
        return connectionInstance;
    } catch (error) {
        console.error("MONGODB connection FAILED: ", error.message || error);
        throw error;
    }
};

export default connectDB;
