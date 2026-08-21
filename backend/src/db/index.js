import mongoose from "mongoose";

const DB_NAME = process.env.DB_NAME || "mastercard_cfc";

const connectDB = async () => {
    try {
        let uri = process.env.MONGODB_URI;
        if (uri.includes('?')) {
            // Ensure no double slashes before DB_NAME if uri has trailing slash before '?'
            uri = uri.replace(/\/?\?/, `/${DB_NAME}?`);
        } else {
            uri = uri.endsWith('/') ? `${uri}${DB_NAME}` : `${uri}/${DB_NAME}`;
        }

        const connectionInstance = await mongoose.connect(uri);
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1);
    }
};

export default connectDB;
