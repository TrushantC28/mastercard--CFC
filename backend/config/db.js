import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
        const dbName = process.env.DB_NAME || "mastercard_cfc";
        const connectionString = uri.includes("?") 
            ? uri.replace("?", `/${dbName}?`) 
            : `${uri}/${dbName}`;
        
        await mongoose.connect(connectionString);
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection failed:", err.message);
        process.exit(1);
    }
};

export default connectDB;
