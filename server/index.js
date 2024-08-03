import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import userRouter from './routers/userRoute.js';
dotenv.config();

const app=express();
const PORT=8000;
app.use(cors());

connectDB();

app.use(express.json());//important for req.body to destructure


app.use('/chat-app/user',userRouter);

app.get('/',(req,res)=>{
    res.send("Api is working");
})

app.listen(PORT,()=>{
    console.log(`Server is running at Port ${PORT}`);
})