import { useEffect, useState } from "react"
import BlogCard from "../components/BlogCard"
import axios from "axios"

import Nav from "../components/Nav"

import { useNavigate } from "react-router-dom"
import useSigned from "../hooks/useSigned"
import BlogSkeleton from "../components/BlogCardSkeleton"


export default function Blogs(){
    const [blogs,setBlogs]=useState([])
    const [loading,setLoading]=useState(true);
    const {isSigned,isLoading,email}=useSigned();

    const navigate=useNavigate();
    
     useEffect(()=>{
        axios.get("https://backend.aman-lalwani208.workers.dev/api/v1/blog/bulk",{
            headers:{
                Authorization:localStorage.getItem('token')
            }
        }).then(function(res){
        console.log(res.data);
        setLoading(false)
        setBlogs(res.data.blogs)
        }).catch(function(err){
        console.log(err)
        })
        


        setInterval(()=>{
           axios.get("https://backend.aman-lalwani208.workers.dev/api/v1/blog/bulk",{
            headers:{
                Authorization:localStorage.getItem('token')
            }
        }).then(function(res){
         setBlogs(res.data.blogs)
        }).catch(function(err){
          console.log(err);
        })
        },10000)

      },[])
       
      console.log(isLoading);
      
      if(isLoading || loading){
        return <>
        <Nav email={email}></Nav>
        <div className="lg:w-1/2 max-w-full lg:m-auto lg:mt-24 px-4">
        <BlogSkeleton></BlogSkeleton>
        <BlogSkeleton></BlogSkeleton>
        <BlogSkeleton></BlogSkeleton>
        <BlogSkeleton></BlogSkeleton>
        </div>
        </>
      }

      if(!isSigned){
        navigate("/signin")
      }
     

  return <>
  <Nav email={email}></Nav>
<div className="lg:w-1/2 max-w-full  lg:m-auto lg:mt-24 px-4">

{blogs.map((blog:{id:string,title:string,content:string,publish_date:string,author:{name:string}})=>{
  return <BlogCard id={blog.id} title={blog.title} content={blog.content} publish_date={blog.publish_date} author={blog.author}></BlogCard>
})}
</div>
</>

}