import React, { useEffect, useState,useRef } from 'react'
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'
import Avatar from './Avatar';
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa6";
import { IoIosAdd } from "react-icons/io";
import { FaRegImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa";
import uploadFile from '../Helper/UploadFile';
import { RxCross2 } from "react-icons/rx";
import { IoSendSharp } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
//for date with message
import moment from 'moment';

const MessagePage = () => {
    const params=useParams();
    const [userData,setUserData]=useState({
        _id:"",
        name:'',
        profile_pic:"",
        email:"",
        online:false
    })
    // console.log("UserId :",params.userId);
    const [uploadPopupOpen,setUploadPopup]=useState(false);
    const [allMessage,setAllMessages]=useState([]);
    const currentMessage = useRef(null);

    useEffect(()=>{
      if(currentMessage.current){
          currentMessage.current.scrollIntoView({behavior : 'smooth', block : 'end'})
      }
  },[allMessage])


    const [message,setMessage]=useState({
      text:"",
      image_url:"",
      video_url:""
    })

    const uploadImageHandler=async(e)=>{
        const file_name=e.target.files[0];
        const response=await uploadFile(file_name);
        console.log("Image : ",response.url);
        setUploadPopup(!uploadPopupOpen);
        setMessage((prev)=>({
            ...prev,image_url:response.url
        }))
        // console.log("Message :",message);
    }

    const clearImageHandler=async()=>{
      setMessage((prev)=>({
        ...prev,image_url:""
    }))
    }

    const uploadVideoHandler=async(e)=>{
        const file_name=e.target.files[0];
        const response=await uploadFile(file_name);
        console.log("Video : ",response.url);
        setUploadPopup(!uploadPopupOpen);
        setMessage((prev)=>({
            ...prev,video_url:response.url
        }))
        // console.log("Message :",message);
    }

    const clearVideoHandler=()=>{
      setMessage((prev)=>({
        ...prev,video_url:""
    }))
    }

    const messageTextHandler=(e)=>{
      setMessage((prev)=>({
        ...prev,text:e.target.value
    }))
    }

    const socketConnection=useSelector(state=>state?.user?.socketConnection);
    const user=useSelector(state=>state?.user);

    const sendMessageHandler=async(e)=>{
      e.preventDefault();

      if(message.text || message.image_url || message.video_url){
        if(socketConnection){
          // console.log("Image :",message?.image_url);
          socketConnection.emit('new message',{
            sender:user?._id,
            receiver:params.userId,
            text:message.text,
            imageUrl:message.image_url,
            videoUrl:message.video_url,
            messageByUserId:user?._id
          })

          socketConnection.on('message',(data)=>{
            setAllMessages(data);
            // console.log("Message data : ",data);
          })


          setMessage({
            text:"",
            image_url:"",
            video_url:""
          })
        }
      }
    }


    useEffect(()=>{
      if(socketConnection){
        socketConnection.emit('message-page',params?.userId)

        socketConnection.emit('seen',params?.userId);
        // console.log("Para");
        socketConnection.on('message-user',async(data)=>{
          await setUserData(data);
        }) 
        
        socketConnection.on('message',async(data)=>{
          console.log('message data',data)
          await setAllMessages(data);
        })

      }
  },[socketConnection,params?.userId,user])


  return (
    <div className='flex w-full h-full max-h-screen flex-col overflow-hidden'>
      <header className='p-2 flex justify-between  items-center sticky top-0 h-16 bg-slate-300'>
        <div className='flex items-center gap-4'>
          <Link to="/" className='lg:hidden'>
          <FaAngleLeft size={25}/>
          </Link>
            <div className='p-0'>
              <Avatar className='p-0'
                userId={userData?._id}
                name={userData?.name}
                imageUrl={userData?.profile_pic}
                width={45} height={45}
              />
            </div>
            <div className='flex flex-col justify-center ml-1'>
              <h2 className='font-semibold text-lg my-0'>{userData?.name}</h2>
              <p className=' text-sm'>
                {
                  userData?.online ? <span className='text-red-950' style={{color:"green"}}>Online</span> : <span className='text-slate-800'>Offline</span>
                }
              </p>
            </div>
          </div>
          <HiOutlineDotsVertical className='cursor-pointer' size={25} />
      </header>

      {/* {show all messages}  */}
      <section className={` relative min-h-[calc(100vh-128px)]  h-[calc(100vh - 128px)] flex flex-col justify-between bg-slate-200 p-2 overflow-x-hidden overflow-y-scroll scrollbar`}>


        {/**all message show here */}
        <div className='flex flex-col gap-2 py-2 mx-2' ref={currentMessage}>
                    {
                      allMessage.map((msg,index)=>{
                        return(
                          <div key={index} className={` p-1 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${user._id === msg?.messageByUserId ? "ml-auto bg-teal-100" : "bg-white"}`}>
                            <div className='w-full relative'>
                              {
                                msg?.imageUrl && (
                                  <img 
                                    src={msg?.imageUrl}
                                    className='w-full h-full object-scale-down'
                                  />
                                )
                              }
                              {
                                msg?.videoUrl && (
                                  <video
                                    src={msg.videoUrl}
                                    className='w-full h-full object-scale-down'
                                    controls
                                  />
                                )
                              }
                            </div>
                            <p className='px-2'>{msg.text}</p>
                            <p className='text-xs ml-auto w-fit'>{moment(msg.createdAt).format('hh:mm')}</p>
                          </div>
                        )
                      })
                    }
        </div>



                {/* {upload image or video popup display} */}
                {
                    message.image_url && (
                      <div className='h-fit w-fit sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center mx-auto items-center rounded border-spacing-0'>
                        <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600' onClick={clearImageHandler}>
                            <IoClose size={30}/>
                        </div>
                        <div className='bg-white p-3'>
                            <img
                              src={message.image_url}
                              alt='uploadImage'
                              className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                            />
                        </div>
                      </div>
                    )
                  }

                  {/**upload video display */}
                  {
                    message.video_url && (
                      <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
                        <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600' onClick={clearVideoHandler}>
                            <IoClose size={30}/>
                        </div>
                        <div className='bg-white p-3'>
                            <video 
                              src={message.video_url} 
                              className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                              controls
                              muted
                              autoPlay
                            />
                        </div>
                      </div>
                    )
                  }

                  {/* {
                    loading && (
                      <div className='w-full h-full flex sticky bottom-0 justify-center items-center'>
                        <p>Loading...</p>
                      </div>
                    )
                  } */}


      </section>

      <section className='z-10  h-16 p-2'>
        <div className="z-10 h-full w-full relative flex items-center gap-2 mx-3">
          <button onClick={()=> setUploadPopup(!uploadPopupOpen)} className='flex justify-center items-center w-11 h-11 rounded-full p-1 bg-slate-400 hover:bg-green-600'>
              <IoIosAdd size={25}/>
          </button>

          {
            uploadPopupOpen && 
            <div className=" absolute bottom-12 left-2 flex flex-col justify-center items-center gap-2 p-2 rounded bg-purple-400">
              <div className="flex justify-center items-center gap-3 hover:bg-slate-100 p-1 rounded">
                <label htmlFor="uploadImage" className="flex justify-center items-center gap-3 hover:bg-slate-100 p-2 rounded">
                <FaRegImage size={25}/>
                <p>Image</p>
                </label>
                

                <input type="file" onChange={uploadImageHandler} className='hidden' id='uploadImage'  src="" alt="" />
              </div>

              <div className="flex justify-center items-center gap-3 hover:bg-slate-100 p-1 rounded">
                <label htmlFor="uploadVideo" className="flex justify-center items-center gap-3 hover:bg-slate-100 p-2 rounded">
                <FaVideo size={25}/>
                <p>Video</p>
                </label>

                <input type="file" onChange={uploadVideoHandler} className='hidden' id='uploadVideo'  src="" alt="" />
              </div>
            </div>
          }

          {/* send message  */}
          <form className="w-full  h-full flex items-center gap-3 mx-3 overflow-hidden">
              <input type="text" name="" value={message.text} onChange={messageTextHandler} placeholder='Type message here...' id="" className='w-full h-full  outline-none' />
              <button className='text-green' onClick={sendMessageHandler}>
                  <IoSendSharp size={28} style={{ color: 'green', marginRight: '15px' }} />
              </button>
          </form>
        </div>
      </section>
    </div>
  )
}

export default MessagePage
