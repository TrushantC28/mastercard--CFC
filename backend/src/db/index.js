import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionUrl = new URL(process.env.MONGODB_URI);
        connectionUrl.pathname = `/${process.env.DB_NAME || "mastercard_cfc"}`;
        const connectionInstance = await mongoose.connect(connectionUrl.toString());
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1);
    }
};

export default connectDB;
