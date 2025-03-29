import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL;

const connectDb = async () => {
    if (mongoose.connection.readyState >= 1) {
        return; // If already connected, don't reconnect
    }
    try {
        await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
};

export default connectDb;
