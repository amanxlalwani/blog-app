import axios from "axios";
import { useEffect, useState } from "react";

export function useProfile(){
    const [profile,setProfile]=useState<{email:string,bio:string,name:string}>({name:"",bio:"",email:""});
    const [modal,setModal]=useState(false);
    useEffect(()=>{        
    axios.get("https://backend.aman-lalwani208.workers.dev/api/v1/profile",{headers:{
        Authorization:localStorage.getItem('token')
    }}).then((res)=>{
     setProfile(res.data['profile'])
    })
    },[])

    return {setModal,modal,profile,setProfile}
}