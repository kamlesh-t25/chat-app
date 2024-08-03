import React, { useState } from 'react'
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { NavLink, useNavigate } from 'react-router-dom';
import { TbLogout2 } from "react-icons/tb";
import { useDispatch, useSelector } from 'react-redux';
import { RxAvatar } from "react-icons/rx";
import { logout } from '../../redux/userSlice';
import {useLocation,Outlet} from 'react-router-dom';
import SearchUser from '../SearchUser';

const SideBar = () => {
  const [searchBarOpen,setSearchBar]=useState(false);
  const navigate=useNavigate();
  const user=useSelector(state=>state.user);
    const dispatch=useDispatch();
    const logoutHandler=()=>{
      localStorage.removeItem("token");
      dispatch(logout());
      // navigate("/login");
      window.location.href = "/login";  // Force navigation with a full page reload
    }

    const location=useLocation();
    const basepath = location.pathname==="/";
  return (
    <div className='w-full h-full grid grid-cols-[48px,1fr]'>
      <div className=' bg-slate-100 w-12 h-full py-5 flex flex-col justify-between'>
        <div>
            <NavLink title='chat' className={({isActive})=>`w-12 h-12 flex justify-center hover:bg-slate-200 items-center cursor-pointer ${isActive && "bg-slate-200"}` }>
            <IoChatbubbleEllipsesOutline 
            size={20}
            />
            </NavLink >

            <NavLink onClick={()=>setSearchBar(true)} className={({isActive})=>`w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200`} >
                <FaUserPlus size={20} />
            </NavLink>
        </div>
        <div>
            <NavLink className={({isActive})=>`w-12 h-12 flex justify-center items-center cursor-pointer`}>
              <RxAvatar size={20} name={user.name}/>
            </NavLink>

            <NavLink onClick={logoutHandler} title='logout' className={({isActive})=>`w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200`} >
                <TbLogout2 size={20} />
            </NavLink>
        </div>
      </div>
      <div className={`z-0 w-full ${basepath && "hidden"} lg:block`}>
        <div className='flex h-16 items-center'>
          <h2 className='text-xl font-bold p-4'>Messages</h2>
        </div>
        <div className='p-[0.5] w-full bg-purple-500'></div>

        <div className='flex items-center h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar'>

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
