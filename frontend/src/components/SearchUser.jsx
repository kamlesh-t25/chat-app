import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { GoSearch } from "react-icons/go";
import SearchUserCard from './SearchUserCard';
import { IoClose } from "react-icons/io5";

const SearchUser = ({onClose}) => {
    const [usersData,setUsers]=useState([]);
    const [searchInput,setSearchInput]=useState("");
    const fetchUsers=async()=>{
        const backendUrl=import.meta.env.VITE_REACT_APP_BACKEND_URL;
        const res1=await axios.get(`${backendUrl}/chat-app/user/getAllUsersData`);
        if(res1.data.success){
            setUsers(res1.data.data);
        }else{
            console.log(res1.data.message);
        }
    }
    useEffect(()=>{
        fetchUsers();
    },[])

  return (
    <div className='fixed z-50 top-0 left-0 right-0 bottom-0 backdrop-blur-sm bg-slate-700 p-2 opacity-100'>
        <div className='w-full max-w-lg mx-auto mt-10'>
            <div className='h-14 flex items-center bg-white rounded'>
                <input onChange={(e)=>setSearchInput(e.target.value)} value={searchInput} className='w-full h-14 outline-none border-none py-1 px-4'
                    type="text" name="searchInput" placeholder='Search user by name...' id="" />
                <div className='h-14 w-14 flex items-center'>
                    <GoSearch size={20}/>
                </div>
            </div> 

            <div className=' flex flex-col bg-white rounded mt-2 p-4'>
                {
                    (usersData.length === 0) ? 
                    <h2>Loading...</h2> :
                    usersData.filter(user => user.name.toLowerCase().includes(searchInput.toLowerCase())).map((user, index) => {
                    return (
                            <SearchUserCard onClose={onClose} user={user} key={user._id} />
                        );
                        })
                    }
            </div>
        </div>
        <div onClick={onClose} className='absolute text-2xl lg:text-4xl hover:text-green-600 right-0 top-0 p-2 m-2 '>
            <IoClose size={25}/>
        </div>

    </div>
  )
}

export default SearchUser
