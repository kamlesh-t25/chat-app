import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
export const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGOOSE_URL).then(()=>{
            console.log("DB connected");
        })
    } catch (error) {
       console.log(error); 
    }
}