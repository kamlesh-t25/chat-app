import React, { useEffect, useState } from 'react'
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { NavLink, useNavigate } from 'react-router-dom';
import { TbLogout2 } from "react-icons/tb";
import { useDispatch, useSelector } from 'react-redux';
import { RxAvatar } from "react-icons/rx";
import { logout } from '../../redux/userSlice';
import {useLocation,Outlet} from 'react-router-dom';
import SearchUser from '../SearchUser';
import Avatar from '../Avatar';
import { FiArrowUpLeft } from "react-icons/fi";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";


const SideBar = () => {
  const [searchBarOpen,setSearchBar]=useState(false);
  const navigate=useNavigate();
  const [allUser,setAllUser] = useState([])
  const user=useSelector(state=>state.user);
    const logoutHandler=()=>{
      localStorage.removeItem("token");
      dispatch(logout());
      // navigate("/login");
      window.location.href = "/login";  // Force navigation with a full page reload
    }

    const location=useLocation();
    const basepath = location.pathname==="/";

    const socketConnection = useSelector(state => state?.user?.socketConnection);
    const dispatch = useDispatch();

    useEffect(()=>{
      if(socketConnection){
          socketConnection.emit('sidebar',user._id)
          
          socketConnection.on('conversation',(data)=>{
              console.log('conversation',data)
              
              const conversationUserData = data.map((conversationUser,index)=>{
                  if(conversationUser?.sender?._id === conversationUser?.receiver?._id){
                      return{
                          ...conversationUser,
                          userDetails : conversationUser?.sender
                      }
                  }
                  else if(conversationUser?.receiver?._id !== user?._id){
                      return{
                          ...conversationUser,
                          userDetails : conversationUser.receiver
                      }
                  }else{
                      return{
                          ...conversationUser,
                          userDetails : conversationUser.sender
                      }
                  }
              })

              setAllUser(conversationUserData)
          })
      }
    },[socketConnection,user])

  return (
    <div className='w-full z-30  h-full grid grid-cols-[48px,1fr] '>
      <div className=' bg-slate-100 w-12 h-full py-5 flex flex-col justify-between'>
        <div>
            <NavLink title='chat' className={({isActive})=>`w-12 h-12 flex justify-center hover:bg-slate-200 items-center cursor-pointer ${isActive && "bg-slate-200"}` }>
            <IoChatbubbleEllipsesOutline 
            size={25}
            />
            </NavLink >

            <NavLink onClick={()=>setSearchBar(true)} className={({isActive})=>`w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200`} >
                <FaUserPlus size={25} />
            </NavLink>
        </div>
        <div>
            <NavLink className={({isActive})=>`w-12 h-12 flex justify-center items-center cursor-pointer`}>
              {/* <RxAvatar size={20} title={user.name}/> */}
              <Avatar userId={user._id} name={user.name} imageUrl={user.profile_pic} width={25} height={25} />
            </NavLink>

            <NavLink onClick={logoutHandler} title='logout' className={({isActive})=>`w-12 h-12 pr-1 flex justify-center items-center cursor-pointer hover:bg-slate-200`} >
                <TbLogout2 size={25} />
            </NavLink>
        </div>
      </div>
      <div className={`w-full`}>
        <div className='flex h-16 items-center'>
          <h2 className='text-xl font-bold p-4'>Messages</h2>
        </div>
        <div className='p-[0.5] w-full bg-purple-500'></div>

        <div className=' h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar'>
                    {
                        allUser.length === 0 && (
                            <div className='mt-12'>
                                <div className='flex justify-center items-center my-4 text-slate-500'>
                                    <FiArrowUpLeft
                                        size={50}
                                    />
                                </div>
                                <p className='text-lg text-center text-slate-400'>Explore users to start a conversation with.</p>    
                            </div>
                        )
                    }

                    {
                        allUser.map((conv,index)=>{
                            return(
                                <NavLink to={"/"+conv?.userDetails?._id} key={conv?._id} className='flex  items-center gap-2 py-3 px-2 border border-transparent hover:border-primary rounded hover:bg-slate-100 cursor-pointer'>
                                    <div>
                                        <Avatar
                                            imageUrl={conv?.userDetails?.profile_pic}
                                            name={conv?.userDetails?.name}
                                            width={35}
                                            height={35}
                                        />    
                                    </div>
                                    <div>
                                        <h3 className='text-ellipsis line-clamp-1 font-semibold text-base'>{conv?.userDetails?.name}</h3>
                                        <div className='text-slate-500 text-xs flex items-center gap-1'>
                                            <div className='flex items-center gap-1'>
                                                {
                                                    conv?.lastMsg?.imageUrl && (
                                                        <div className='flex items-center gap-1'>
                                                            <span><FaImage/></span>
                                                            {!conv?.lastMsg?.text && <span>Image</span>  } 
                                                        </div>
                                                    )
                                                }
                                                {
                                                    conv?.lastMsg?.videoUrl && (
                                                        <div className='flex items-center gap-1'>
                                                            <span><FaVideo/></span>
                                                            {!conv?.lastMsg?.text && <span>Video</span>}
                                                        </div>
                                                    )
                                                }
                                            </div>
                                            <p className='text-ellipsis line-clamp-1'>{conv?.lastMsg?.text}</p>
                                        </div>
                                    </div>
                                    {
                                        Boolean(conv?.unseenMsg) && (
                                            <p className='text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 bg-primary text-white font-semibold rounded-full'>{conv?.unseenMsg}</p>
                                        )
                                    }

                                </NavLink>
                            )
                        })
                    }
                </div>

      </div>

      {/* {Search User} */}
      {
        searchBarOpen && (<SearchUser onClose={()=>setSearchBar(false)} />)
      }


    </div>
  )
}

export default SideBar
