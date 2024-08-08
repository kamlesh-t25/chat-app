import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import userRouter from './routers/userRoute.js';
import { server,app } from './socket/index.js';
dotenv.config();

// const app=express();..can use one defined in socket/index.js

const PORT=process.env.PORT  || 8080;

console.log(process.env.FRONTEND_URL);
// app.use(cors({
//     origin:process.env.FRONTEND_URL,
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials:true
// }));

app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
  }));

// Handle preflight (OPTIONS) requests explicitly if needed
app.options('*', cors());

await connectDB();

app.use(express.json());//important for req.body to destructure


app.use('/chat-app/user',userRouter);

app.get('/',(req,res)=>{
    res.send("Api is working");
})

server.listen(PORT,()=>{
    console.log(`Server is running at  http://localhost:${PORT}`);
})