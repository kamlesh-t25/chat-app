import React from 'react'
import { RxAvatar } from "react-icons/rx";
import { useSelector } from 'react-redux';
import { FaUserLarge } from "react-icons/fa6";
import { CiUser } from "react-icons/ci";

const Avatar = ({userId,name,imageUrl,width,height}) => {
    const onlineUser=useSelector(state => state?.user?.onlineUser);
    const isActive =onlineUser.includes(userId);
    
    // console.log(userId ," : ", isActive);
  return (
    <div className={`overflow-hidden relative rounded-full ${isActive ? 'border-purple-950' : 'border-black'} `} title={name} 
    style={{width:width+"px",height:height+"px" }}
    >
      {
        imageUrl ? 
        <img className={`w-full h-full object-cover ${isActive ? 'border-purple-950' : 'border-black'} rounded-full`}  
        style={{border: '2px solid black',borderRadius : "50%"}}
        // width={width} height={height}
         alt={name}
        src={imageUrl}  />
        :
        <CiUser  size={width} title={name} className={`${isActive ? 'text-green-500' : 'text-black'} p-1`} style={{border: '2px solid black',borderRadius : "50%"}}/>

      }

{isActive && (
                <div
                    className="absolute bottom-2 right-0 bg-green-500 p-1 rounded-full"></div>
            )}
    </div>
  )
}

export default Avatar
