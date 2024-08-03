import React, { useState } from 'react'
import './Register.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import uploadFile from '../../Helper/UploadFile';

const Register = ({URL}) => {
    const navigate=useNavigate();

    const [data,setData]=useState({
        name:"",
        email:"",
        password:"",
        profile_pic:""
    })

    const [photo,uploadPhoto]=useState("");
    const onChageHandler=(e)=>{
        const name=e.target.name;
        if(name=="profile_pic"){
            setData((prev)=>({...prev,[profile_pic]:e.target.files[0]}))
        }else setData((prev)=>({...prev,[name]:e.target.value}));
    }



    const onImageHandler=async(e)=>{
        const file_name=e.target.files[0];
        uploadPhoto(file_name);
        // console.log("Image :",photo);
        const response=await uploadFile(file_name);
        // console.log("response : ",response.url);
        setData((prev)=>({
            ...prev,profile_pic:response.url
        }))

    }

    const onSubmitHandler=async(e)=>{
        e.preventDefault();
        console.log(data);
        const response=await axios.post(URL+"/chat-app/user/register",data);
        if(response.data.success){
            console.log(response.data.token);
            navigate("/login");
        }else{
            console.log(response.data.message);
        }
    }

  return (
    <div className='register-container'>
      <form onSubmit={onSubmitHandler}>
        <div className="register-text">
            <h3>Register</h3>
        </div>
        <div className="input-field">
            <input onChange={onChageHandler} type="text" value={data.name} name="name" id="name" required/>
            <label htmlFor="name">Name</label>
        </div>
        <div className="input-field">
            <input onChange={onChageHandler} type="text" value={data.email} name="email" id="email" required/>
            <label htmlFor="email">Email</label>
        </div>
        <div className="input-field">
            <input onChange={onChageHandler} type="text" value={data.password} name="password" id="password" required/>
            <label htmlFor="password">Password</label>
        </div>
        <div className="input-image">
            <label htmlFor="profile_pic">Photo
                <div className="input-image-section">
                    {photo? photo.name : "Upload profile photo"}
                </div>
            </label>
            <input className='hidden' onChange={onImageHandler}  type="file"  name="profile_pic" id="profile_pic"  accept="image/*" // Optional: Limit to image files only
            />
            {/* <label htmlFor="">Photo</label> */}
        </div>
        <div className="submit-button">
            <button type="submit">Register</button>
        </div>

        <div className="navigate-login">
            <p>Already have an account ? <span className='login-text' onClick={()=>navigate('/login')}>Login here</span></p>
        </div>
      </form>
    </div>
  )
}


export default Register
