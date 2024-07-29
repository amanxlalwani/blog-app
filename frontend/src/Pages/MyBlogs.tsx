import { useEffect, useState } from "react"
import MyBlogCard from "../components/MyBlogCard"
import axios from "axios"

import Nav from "../components/Nav"

import { useNavigate } from "react-router-dom"
import useSigned from "../hooks/useSigned"
import BlogSkeleton from "../components/BlogCardSkeleton"




export default function MyBlogs(){
    const [blogs,setBlogs]=useState([])
    const [loading,setLoading]=useState(true);
    const {isSigned,isLoading,email}=useSigned();

    const navigate=useNavigate();
    
     useEffect(()=>{
        axios.get("https://backend.aman-lalwani208.workers.dev/api/v1/blog/myblogs",{
            headers:{
                Authorization:localStorage.getItem('token')
            }
        }).then(function(res){
        console.log(res.data);
        setLoading(false)
        console.log(res.data);
        setBlogs(res.data.blogs)
        }).catch(function(err){
        console.log(err)
        })
        


        setInterval(()=>{
           axios.get("https://backend.aman-lalwani208.workers.dev/api/v1/blog/myblogs",{
            headers:{
                Authorization:localStorage.getItem('token')
            }
        }).then(function(res){
         setBlogs(res.data.blogs)
        
        }).catch(function(err){
          console.log(err);
        })
        },1000000)

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
    
      if(blogs.length==0){
        return<>
        <Nav email={email}></Nav>
        <div className="lg:w-1/2 h-full max-w-full  lg:m-auto lg:mt-24 px-4">
        <div className="flex h-2/3 text-xl font-semibold justify-center items-center" >
            You have written no blogs
        </div>
        </div>
        </>
      }

  return <>
  <Nav email={email}></Nav>

<div className="lg:w-1/2 max-w-full  lg:m-auto lg:mt-24 px-4">
<div className="font-semibold text-3xl text-center lg:text-left lg:text-5xl w-full mt-10 lg:mt-2" >My Blogs</div>
{blogs.map((blog:{id:string,title:string,content:string,publish_date:string,author:{name:string}})=>{
  return <MyBlogCard id={blog.id} title={blog.title} content={blog.content} publish_date={blog.publish_date} author={blog.author}></MyBlogCard>
})}
</div>
</>

}