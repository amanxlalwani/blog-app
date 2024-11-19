import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import useSigned from "../hooks/useSigned";
import BlogPageSkeleton from "../components/BlogPageSkeleton";
import Nav from "../components/Nav";
import LikesSection from "../components/LikesSection";
import CommentSection from "../components/CommentSection";
import { useProfile } from "../hooks/useProfile";

import { toast } from "react-toastify";
import SubscribeButton from "../components/SubscribeButton";


export default function Blog(){
   const {id}=useParams();
   const {modal,setModal}=useProfile();
   
   const [loading,setLoading]=useState(true);
   const [blog,setBlog]=useState({id:"",title:"",content:"",publish_date:"",author:{id:"",name:"",bio:"",User:[{id:"",user_id:"",subscriber_id:""}]},likes:[{
    userId:"",
    has_liked:false
   }]})
   const navigate=useNavigate() 
   const {isSigned,isLoading,email,userId}=useSigned();
   const [numberofSubscribers,setNumberOfSubscribers]=useState(0);
   const [isSubscribed,setSubscribed]=useState(false)
   const [subscribeId,setSubscribeId]=useState<string | null>(null)
   const [isBlur,setIsBlur]=useState(false);
       
   function nooflikes(likes:{userId:string,has_liked:boolean}[]):number{
    var c=0
    likes.forEach(element => {
    if(element.has_liked){
     c++;
    }
  });
  return c
  }
     
   function hasLiked(likes:{userId:string,has_liked:boolean}[]):boolean{
    console.log(likes);
    var val=false;
    likes.forEach(element => {
      if(element.userId == userId){
         if(element.has_liked)
         {
          val=true;
         }
      }
    });
    return val
   }


   function hasSubscribed(User:{id:string,user_id:string,subscriber_id:string}[]):boolean{
      var val=false
      User.forEach(ele=>{
         var c=0;
         console.log("User"+c++);
         
         console.log(ele);
         
      if(ele.subscriber_id == userId){
       val=true
       setSubscribeId(ele.id)
      }
   });
   return val
   }

   useEffect(()=>{
    axios.get("https://backend.aman-lalwani208.workers.dev/api/v1/blog/"+id,{
        headers:{
            Authorization:localStorage.getItem('token')
        }
    }).then(function(res){
    setLoading(false)
    setBlog(res.data.blog)    
    }
   ).catch(function(){
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

    },1000000)

   },[id])
   
   useEffect(()=>{
      setNumberOfSubscribers(blog.author.User.length)
      setSubscribed(hasSubscribed(blog.author.User))
   },[blog])


   if(isLoading || loading){
    return <>
    <Nav setIsBlur={setIsBlur} email={email} modal={modal} setModal={setModal}></Nav>
    <BlogPageSkeleton></BlogPageSkeleton>
    </>
   }
  
   if(!isSigned){
    navigate('/signin')
   }



    return <> <Nav setIsBlur={setIsBlur} email={email} modal={modal} setModal={setModal}></Nav> <div className={modal||isBlur?"blur-sm  select-none":""}>
    
   <div onClick={()=>{setModal(false)}} className="w-11/12 m-auto px-6 mt-14 pb-8 lg:grid lg:gap-4 lg:grid-cols-4 break-words " >
    <div className="lg:col-span-3 ">
 <div className="text-2xl lg:text-5xl  font-extrabold">{blog.title}</div>
     <div className="text-sm my-2 mb-4 text-gray-500">Posted On {(blog.publish_date).slice(0,10)}</div>
    <div>{blog.content}</div>
 </div>

 <div className="mt-10 lg:mt-0">
  <div>Author</div>
  <div className="flex items-baseline gap-4 ">
  <div className="text-xl font-extrabold">{blog.author.name}
  <div className="text-sm font-light text-slate-800">{numberofSubscribers}  Subscribers</div> 
  </div>
  <div >{isSubscribed?<><SubscribeButton  title="Unsubscribe" onClick={async ()=>{
    try{
    const res:{data:{status:number}}=await axios.post("https://backend.aman-lalwani208.workers.dev/api/v1/user/unsubscribe",{subscribeId:subscribeId,subscriber_id:userId,user_id:blog.author.id},{
   headers:{
       Authorization:localStorage.getItem('token')
   }})  
   if(res.data.status==200){
      setSubscribeId(null)
      setSubscribed(false)
      setNumberOfSubscribers((numberofSubscribers)=>numberofSubscribers-1)
      toast.info("Subscribtion removed")
   }
   else{
      toast.error("Something went wrong!")
      console.error("Database Error");
      
   }
}
   catch{
      toast.error("Something went wrong!")
      console.error("Axios error");
   }
}} /></>:<><SubscribeButton  title="Subscribe" onClick={async ()=>{
   try{
   const res:{data:{status:number ,subscribeId:string,message:string} }=await axios.post("https://backend.aman-lalwani208.workers.dev/api/v1/user/subscribe",{subscriber_id:userId,user_id:blog.author.id},{
      headers:{
          Authorization:localStorage.getItem('token')
      }}) 
      if(res.data.status==200){ 
      console.log(res);
      setSubscribeId(res.data.subscribeId)
      setSubscribed(true)
      setNumberOfSubscribers((numberofSubscribers)=>numberofSubscribers+1)
      toast.info("Subscribtion added")
      }
      else{
         toast.error("Something went wrong!")
         console.error("Database Error");
         
      }
   }
      catch{
       toast.error("Something went wrong!")
       console.error("Axios error");
         
      }
  }} /></>}</div>
  </div>
  
  <div className="text-lg">{blog.author.bio}</div>
  <div className="mt-10">
    <LikesSection id={blog.id} isLiked={hasLiked(blog.likes)} likes={nooflikes(blog.likes)} ></LikesSection>
 </div>
 </div>  
</div>
 <div className="w-11/12 m-auto px-6 lg:mt-14 lg:grid lg:gap-4 lg:grid-cols-4">
 <div className="lg:col-span-3">
    <CommentSection blogId={blog.id}></CommentSection>
 </div>
 </div>

    </div>
    </>
}