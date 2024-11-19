import axios from "axios";
import { useEffect, useState } from "react";



export default function useSigned(){
    const[isSigned , setIsSigned]=useState(false);
    const [email,setEmail]=useState("");  
    const [isLoading ,setIsLoading]=useState(true);
    const [userId,setUserId]=useState("")
    useEffect(()=>{
      const token = localStorage.getItem('token');
      if(token){
      axios.get("https://backend.aman-lalwani208.workers.dev/api/v1/user/me",{
         headers:{
             Authorization:localStorage.getItem('token')
         }
     }).then(function(res){
         console.log(res);
         
         if(res.data.success){
            setIsSigned(true);
            setIsLoading(false);
            setEmail(res.data.user.email)
            setUserId(res.data.user.id)
         }
         else{
            setIsSigned(false);
            setIsLoading(false);
         }  
     }).catch(function(){
      setIsSigned(false);
      setIsLoading(false);
     })
    }
    
    else{
    setIsSigned(false);
    setIsLoading(false);
    }
  
    },[])
  
  return {isSigned,isLoading,email,userId}
  
  }
  