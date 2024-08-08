import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import userRouter from './routers/userRoute.js';
import { server,app } from './socket/index.js';
dotenv.config();

// const app=express();..can use one defined in socket/index.js

const PORT=process.env.PORT  || 8080;


app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}));

connectDB();

app.use(express.json());//important for req.body to destructure


app.use('/chat-app/user',userRouter);

app.get('/',(req,res)=>{
    res.send("Api is working");
})

server.listen(PORT,()=>{
    console.log(`Server is running at  http://localhost:${PORT}`);
})