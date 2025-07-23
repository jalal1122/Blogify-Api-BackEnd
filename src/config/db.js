import mongoose from "mongoose";

// connect to MongoDB using mongoose
const connectDB = async () => {
    const MONGO_URI = process.env.CONNECTION_STRING;

    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1); // Exit the process with failure
    }
}

export default connectDB;