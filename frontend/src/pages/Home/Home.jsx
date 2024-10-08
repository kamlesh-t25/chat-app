import React, { useEffect } from 'react'
import './Home.css';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {setUser,setOnlineUser, setToken, setSocketConnection} from '../../redux/userSlice';
import {useLocation,Outlet} from 'react-router-dom';
import SideBar from '../../components/SideBar/SideBar';
import io from 'socket.io-client';
import MessagePage from '../../components/MessagePage';

const Home = () => {
  const user=useSelector(state=>state.user);
  const location=useLocation();
  // console.log("Redux user :" ,user);
  useEffect(()=>{
    console.log("Redux user :" ,user);
  },[])
  const dispatch=useDispatch();
  const fetchUserDetails=async()=>{
    try {
      const backendUrl=import.meta.env.VITE_REACT_APP_BACKEND_URL;
      // console.log(`${backendUrl}/chat-app/user/userDetails`);
      const userData=await axios.post(`${backendUrl}/chat-app/user/userDetails`,{token:localStorage.getItem('token')});
      // console.log(userData.data);
      dispatch(setUser(userData.data.data));
      dispatch(setToken(localStorage.getItem("token")));
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    fetchUserDetails();
  },[]);

  // ***socket connection 
  useEffect(()=>{
    const socketConnection=io(import.meta.env.VITE_REACT_APP_BACKEND_URL,{
      auth:{
        token:localStorage.getItem("token")
      }
    });

    socketConnection.on('onlineUser',(data)=>{
      console.log("Online user : ",data);
      dispatch(setOnlineUser(data));
    })

    dispatch(setSocketConnection(socketConnection));

    return (()=>{
      socketConnection.disconnect();
    })

  },[])


// console.log(location);
  const basepath = location.pathname==="/";
  return (
    <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen overflow-x-hidden'>
      <section className={`bg-slate-50 ${!basepath && "hidden"} lg:block`}>
        <SideBar/>      
      </section>


      <section className={`${basepath && "hidden"} `}>
        {/* <p>Message Component</p> */}
        <MessagePage />
        <Outlet/>
      </section>

      <section className={`z-0 justify-center items-center hidden ${!basepath ? "hidden":"lg:flex"}`}>
        <h2 className='text-2xl bold'>Welcome to Chat App</h2>
      </section>
    </div>
  )
}

export default Home
