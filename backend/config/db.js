import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
        const dbName = process.env.DB_NAME || "mastercard_cfc";
        const connectionUrl = new URL(uri);
        connectionUrl.pathname = `/${dbName}`;
        
        await mongoose.connect(connectionUrl.toString());
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection failed:", err.message);
        process.exit(1);
    }
};

export default connectDB;
