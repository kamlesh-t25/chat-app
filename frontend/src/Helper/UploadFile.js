const url=`https://api.cloudinary.com/v1_1/dbtolytse/auto/upload`;
import axios from 'axios';
// import dotenv from 'dotenv'
// dotenv.config();

// console.log("process.env.CLODINARY_CLOUD_NAME",import.meta.process.env.VITE_CLODINARY_CLOUD_NAME);

const uploadFile=async(file)=>{
    const formData=new FormData();
    formData.append("file",file);
    formData.append("upload_preset","chat-app");

    const response=await fetch(url,{
        method:'post',
        body:formData
    })
    const responseData=await response.json();
    return responseData;
}

export default uploadFile;