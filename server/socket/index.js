import express from 'express';
import http from "http";
import {Server} from 'socket.io';
import { getUserDetails, getUserUsingToken } from '../controllers/userController.js';
import userModel from '../models/userModel.js';
import { conversationModel, messageModel } from '../models/ConversationModel.js';
import getConversation from '../helpers/getConversation.js';

const app=express();

// socket connection 
const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:process.env.FRONTEND_URL,
        credentials:true
    }
})

// * socket running at http://localhost:8080/*
const onlineUser=new Set();

io.on('connection',async(socket)=>{
    // console.log("Connected User :",socket.id);
    const token=socket.handshake.auth.token;
    //current user
    const userData=await getUserUsingToken(token);
    if (!userData) {
        socket.emit('error', { message: 'Token not found or invalid' });
        return;
    }
    // console.log(userData);
    //create a room
    socket.join(userData?._id.toString());
    onlineUser.add(userData?._id.toString());

    io.emit('onlineUser',Array.from(onlineUser));

    socket.on("message-page",async(userId)=>{
        console.log("UserId :",userId);
        const userDetails=await userModel.findById(userId).select("-password");
        const payload={
            _id:userDetails?._id,
            name:userDetails?.name,
            email:userDetails?.email,
            profile_pic:userDetails?.profile_pic,
            online:onlineUser.has(userId)
        }
        socket.emit("message-user",payload);

        //previous msg to user
        const getConversation=await conversationModel.findOne({
            "$or" : [
                {sender:userData?._id , receiver:userId},
                {sender:userId , receiver:userData?._id}
            ]
        }).populate("messages").sort({updatedAt : -1})

        socket.emit('message',getConversation?.messages || [])
    })


    socket.on('new message',async(data)=>{
        // console.log("Data :",data);
        let conversation= await conversationModel.findOne({
            "$or" : [
                {sender:data?.sender , receiver: data?.receiver},
                {sender:data?.receiver , receiver:data?.sender}
            ]
        })
        // console.log("Conversation :",conversation);
            //if conversation does not exist
            if(!conversation){
                const createConversation=await conversationModel({
                    sender :data?.sender,
                    receiver :data?.receiver
                })
                conversation=await createConversation.save();
            }

            const message=new messageModel({
                text:data.text,
                imageUrl:data.imageUrl,
                videoUrl:data.videoUrl,
                messageByUserId:data?.messageByUserId
            })

            const savedMessage=await message.save();
        // console.log("Conversation :",conversation);
        const updatedConversation=await conversationModel.updateOne({_id:conversation?._id},{
            "$push" : {
                "messages":savedMessage?._id
            }
        })

        const getConversation=await conversationModel.findOne({
            "$or" : [
                {sender:data?.sender , receiver:data?.receiver},
                {sender:data?.receiver , receiver:data?.sender}
            ]
        }).populate("messages").sort({updatedAt : -1})

        io.to(data?.sender).emit('message',getConversation.messages);
        io.to(data?.receiver).emit('message',getConversation.messages);
    })

    //sidebar
    socket.on('sidebar',async(currentUserId)=>{
        console.log("current user",currentUserId)

        const conversation = await getConversation(currentUserId)

        socket.emit('conversation',conversation)
        
    })

    socket.on('seen',async(msgByUserId)=>{
        
        let conversation = await conversationModel.findOne({
            "$or" : [
                { sender : userData?._id, receiver : msgByUserId },
                { sender : msgByUserId, receiver :  userData?._id}
            ]
        })

        const conversationMessageId = conversation?.messages || []

        const updateMessages  = await messageModel.updateMany(
            { _id : { "$in" : conversationMessageId }, messageByUserId : msgByUserId },
            { "$set" : { seen : true }}
        )

        //send conversation
        const conversationSender = await getConversation(userData?._id?.toString())
        const conversationReceiver = await getConversation(msgByUserId)

        io.to(userData?._id?.toString()).emit('conversation',conversationSender)
        io.to(msgByUserId).emit('conversation',conversationReceiver)
    })


    socket.on('disconnect',()=>{
        onlineUser.delete(userData?._id);
        console.log("User disconnected : ",socket.id);
    })
})

export {server,app};