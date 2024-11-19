import { useState } from "react";
import useSigned from "../hooks/useSigned"
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate ,Link} from "react-router-dom";
import { blogType } from "@amanxlalwani/blog-app-common";
import Loading from "../components/Loading";


export default function CreateBlog(){

    const [blog,setBlog]=useState<blogType>({title:"",content:""})
    const {isSigned,isLoading}=useSigned();
    const [loading,setLoading]=useState(false);


    const navigate=useNavigate();
   
    if(isLoading || loading){
        return <>
        <Loading></Loading>
        </>
    }

    if(!isSigned){
        navigate('/signin')
    }


return <>
<div className="flex justify-between px-4  mt-20 lg:mt-4 pb-8">
  <Link to="/blogs"><div className="text-3xl font-bold">Sadhan</div></Link>  
  <div className=" w-20 bg-green-600 flex justify-center items-center rounded cursor-pointer" onClick={async ()=>{
   
   if(blog.title=="" || blog.content==""){
    toast.error("Fields cannot empty")
    return
   }
    setLoading(true);
    try{
    const res=await axios.post("https://backend.aman-lalwani208.workers.dev/api/v1/blog",blog,{
        headers:{
            Authorization:localStorage.getItem('token')
        }
    })
    setLoading(false);
        toast.success(res.data.message);
        navigate("/blogs")
    }
    catch(err:any){
        setLoading(false)
        console.log(err);
        const message=err.response.data['message']; 
        toast.error(message)
  }}}>Publish</div>


</div>
<div className="flex flex-col w-10/12 lg:w-1/2 lg:gap-12 m-auto lg:mt-4 "> 
   <div>
   <input type="text" className="lg:text-7xl text-3xl mt-8 lg:mt-0 w-full focus:outline-none" onChange={(e)=>{setBlog({...blog,title:e.target.value})}} placeholder="Title" autoFocus={true}  /> <br />
   <textarea className="lg:text-2xl text-md mt-4 lg:mt-0 w-full focus:outline-none"  onChange={(e)=>{setBlog({...blog,content:e.target.value})}}   maxLength={5000000000} rows={4000} placeholder="Tell your story..."/>
   </div>
</div>

</>
}