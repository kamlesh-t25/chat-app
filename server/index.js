import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import userRouter from './routers/userRoute.js';
import { server, app } from './socket/index.js';

dotenv.config();

const PORT = process.env.PORT || 8080;

// CORS setup
app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));

// Body parser middleware
app.use(express.json()); // Important for req.body to be parsed

// Database connection
await connectDB();

// Routes
app.use('/chat-app/user', userRouter);

// Test route
app.get('/', (req, res) => {
    res.send("API is working");
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
