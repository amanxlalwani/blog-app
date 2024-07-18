import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import useSigned from "../hooks/useSigned";
import BlogPageSkeleton from "../components/BlogPageSkeleton";
import Nav from "../components/Nav";


export default function Blog(){
   const {id}=useParams();
   const [loading,setLoading]=useState(true);
   const [blog,setBlog]=useState({id:"",title:"",content:"",publish_date:"",author:{name:""}})
   const navigate=useNavigate() 
   const {isSigned,isLoading,email}=useSigned();

   useEffect(()=>{
    axios.get("https://backend.aman-lalwani208.workers.dev/api/v1/blog/"+id,{
        headers:{
            Authorization:localStorage.getItem('token')
        }
    }).then(function(res){
    console.log(res.data);
    setLoading(false)
    setBlog(res.data.blog)
    }).catch(function(){
       navigate("/signup")
    })
    
    setInterval(()=>{
       axios.get("https://backend.aman-lalwani208.workers.dev/api/v1/blog/"+id,{
        headers:{
            Authorization:localStorage.getItem('token')
        }
    }).then(function(res){
     setBlog(res.data.blog)
    }).catch(function(){
      navigate("/signup")
      
    })

    },10000)

   },[id])
   
   if(isLoading || loading){
    return <>
    <Nav email={email}></Nav>
    <BlogPageSkeleton></BlogPageSkeleton>
    </>
   }
  
   if(!isSigned){
    navigate('/signin')
   }



    return <>
    <Nav email={email}></Nav>
   <div className="w-11/12 m-auto px-6 mt-14 lg:grid lg:gap-4 lg:grid-cols-4 break-words " >
    <div className="lg:col-span-3 ">
 <div className="text-2xl lg:text-5xl  font-extrabold">{blog.title}</div>
     <div className="text-sm my-2 mb-4 text-gray-500">Posted On {(blog.publish_date).slice(0,10)}</div>
    <div>{blog.content}</div>
 </div>

 <div className="mt-10 lg:mt-0">
  <div>Author</div>
  <div className="text-xl font-extrabold  ">{blog.author.name}</div>
 </div>
    
   </div>


    </>
}