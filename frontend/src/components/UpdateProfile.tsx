import { useState } from "react"
import InputBox from "./InputBox"
import { TextArea } from "./TextArea";
import Button from "./Button";
import axios from "axios";
import { toast } from "react-toastify";




export default function UpdateProfile({setModal, profile ,setProfile}:{setModal:React.Dispatch<React.SetStateAction<boolean>> ,profile :{name:string,email:string,bio:string},setProfile:React.Dispatch<React.SetStateAction<{
    email: string;
    bio: string;
    name: string;
}>>
}){
   const [profilesection,setProfileSection]=useState(profile);
   const [password,setPassword]=useState("");
  
return<>
    
<div className="z-10 flex flex-col  items-center justify-center  absolute left-1/2 translate-x-[-50%] md:translate-y-[15%] lg:translate-y-[25%] sm:translate-y-[10%] translate-y-[5%]      rounded-lg bg-slate-200 w-3/4 h-fit  p-4 md:p-6 pb-8 lg:w-2/5">
<div onClick={()=>setModal(false)} className="self-end  pr-2 mb-4 cursor-pointer"><img width="30" height="30" src="https://img.icons8.com/ios-glyphs/30/multiply.png" alt="multiply"/></div>
<div className="w-full lg:w-2/3">

<InputBox disabled={true} required={true} name="Email" placeholder="" type='email'  value={profilesection.email} onChange={()=>{}}   ></InputBox>
<InputBox required={true} name="Name" placeholder="" type='text' value={profilesection.name} onChange={(e)=>{setProfileSection({...profilesection,name:e.target.value})}}   ></InputBox>
<TextArea name={"Bio"} placeholder="" value={profilesection.bio|| ""} onChange={(e)=>{setProfileSection({...profilesection,bio:e.target.value})}} ></TextArea>
 <Button title="Update Details" onClick={async ()=>{
   try{
    const res=await axios.put("https://backend.aman-lalwani208.workers.dev/api/v1/profile",profilesection,{headers:{
        Authorization:localStorage.getItem('token')
    }})
   if(res.status==200){
    toast.success(res.data["message"])
    setProfile(profilesection)
   }
   else{
    toast.error(res.data["message"])

   }
   }
   catch(err){
    console.log(err);
    
    toast.error("Someting went wrong")
   }
 }} ></Button>
</div>
<div className=" w-full lg:w-2/3 mt-6">
<InputBox required={true} name="Change Password" placeholder="New Password" type='password' onChange={(e)=>setPassword(e.target.value)}  ></InputBox>
<Button title="Update Password" onClick={async ()=>{
try{
    const res=await axios.put("https://backend.aman-lalwani208.workers.dev/api/v1/profile/changepassword", {password} ,{headers:{
        Authorization:localStorage.getItem('token')
    }})
   if(res.status==200){
    toast.success(res.data["message"])
    setProfile(profilesection)
   }
   else{
    toast.error(res.data["message"])
    console.log(1111111);
    
   }
   }
   catch(err){
    console.log(err);
    
    toast.error("Someting went wrong")
   }
    
}}></Button>
</div>
    </div>
    
    </>
}