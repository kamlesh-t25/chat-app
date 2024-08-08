import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGOOSE_URL, {
            serverSelectionTimeoutMS: 30000 // Optional: Increase timeout if needed
        });
        console.log("DB connected");
    } catch (error) {
        console.error("Error connecting to DB:", error);
    }
}
