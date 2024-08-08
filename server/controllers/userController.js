import exprss from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import userModel from '../models/userModel.js';
import dotenv from 'dotenv';
dotenv.config();

const createToken=(id)=>{
    return jwt.sign({id},process.env.SECRET_KEY);
}

const registerUser=async(req,res)=>{
    const {name,email,password,profile_pic}=req.body;

    const user=await userModel.findOne({email});
    if(user){
        return res.json({success:false,message:"User already exist!"});
    }
    
    const salt=await bcrypt.genSalt(8);
    const hashedPassword=await bcrypt.hash(password.toString(),salt);
    const newUser=new userModel({
    name,email,password:hashedPassword,profile_pic
    });
    
    try {
        await newUser.save();
        const token=createToken(newUser._id);
        res.json({success:true,token})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

const loginUser=async(req,res)=>{
    const {email,password}=req.body;

    const user=await userModel.findOne({email});
    if(!user){
        return res.json({success:false,message:"User doesn't exist !"});
    }

    // console.log(user);

    const isMatch=await bcrypt.compare(password,user.password);

    if(isMatch){
        const token=createToken(user._id);
        return res.json({success:true,token});
    }else{
        return res.json({success:false,message:"Incorrect Password !"});
    }
}

const getUserDetails=async(req,res)=>{
    const token=req.body.token;

    try {
        if(!token){
            return res.json({success:false,message:"Token not found"});
        }
        const decode=await jwt.verify(token.toString(),process.env.SECRET_KEY);
        // console.log(decode);
        const userDetails=await userModel.findById(decode.id).select('-password');
        res.json({success:true,data:userDetails});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

const getUserUsingToken=async(token)=>{
        if(!token){
            return {message:"TOken not found"};
        }
        const decode=await jwt.verify(token.toString(),process.env.SECRET_KEY);
        // console.log(decode);
        const userDetails=await userModel.findById(decode.id).select('-password');
        return userDetails;
}


const updateUserDetails=async(req,res)=>{
    const token=req.body.token;
    if (!token) {
        return res.status(400).json({ success: false, message: 'Token is required' });
      }
    try {
        if(!token){
            return res.json({success:false,message:"Token is empty!"});
        }
        const decode=await jwt.verify(token.toString(),process.env.SECRET_KEY);
        const {name,profile_pic}=req.body;
        const user=await userModel.findById(decode.id);
        const updatedUser = await userModel.findByIdAndUpdate(
            decode.id,
            { name, profile_pic },
            { new: true } // Return the updated document
          );

        if (!updatedUser) {
           return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.json({success:true,data:updatedUser,message:"User updated successfully !"});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

const getAllUser=async(req,res)=>{
    try {
        const response=await userModel.find({});
        res.json({success:true,data:response});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error in fetching all users data"});
    }
}


export {registerUser,loginUser,getUserDetails,updateUserDetails,getAllUser,getUserUsingToken};