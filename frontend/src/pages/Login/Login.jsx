import React ,{useState} from 'react'
import './Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({URL}) => {
    const navigate=useNavigate();
    const [data,setData]=useState({
        // name:"",
        email:"",
        password:""
        // image:""
    })

    const onChangeHandler=(e)=>{
        const name=e.target.name;
        setData((prev)=>({...prev,[name]:e.target.value}));
    }

    const onSubmitHandler=async(e)=>{
        e.preventDefault();
        // console.log(data);
        const response=await axios.post(URL+"/chat-app/user/login",data);
        if(response.data.success){
            // console.log(response.data.token);
            localStorage.setItem("token",response.data.token);
            navigate("/");
        }else{
            console.log(response.data.message);
        }
    }

  return (
    <div className='register-container'>
      <form onSubmit={onSubmitHandler}>
        <div className="register-text">
            <h3>Login</h3>
        </div>
        {/* <div className="input-field">
            <input onChange={onChageHandler} type="text" value={data.name} name="name" id="name" required/>
            <label htmlFor="name">Name</label>
        </div> */}
        <div className="input-field">
            <input onChange={onChangeHandler} type="text" value={data.email} name="email" id="email" required/>
            <label htmlFor="email">Email</label>
        </div>
        <div className="input-field">
            <input onChange={onChangeHandler} type="text" value={data.password} name="password" id="password" required/>
            <label htmlFor="password">Password</label>
        </div>
        
        <div className="submit-button">
            <button type="submit">Login</button>
        </div>

        <div className="navigate-login">
            <p>Don't have an account ? <span className='login-text' onClick={()=>navigate('/register')}>Register here</span></p>
        </div>
      </form>
    </div>
  )
}

export default Login
