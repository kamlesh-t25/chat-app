import express from 'express';
import { getAllUser, getUserDetails, loginUser, registerUser, updateUserDetails } from '../controllers/userController.js';

const userRouter=express.Router();

userRouter.post('/register',registerUser);
userRouter.post('/login',loginUser);
userRouter.post('/userDetails',getUserDetails);
userRouter.post('/update',updateUserDetails);
userRouter.get("/getAllUsersData",getAllUser);
export default userRouter;