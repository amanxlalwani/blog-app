
import like_button from '../assets/like_button.png'
import liked from '../assets/liked.png'
import { useState } from "react";
import axios from "axios";


export default function LikesSection(blog:{id:string,isLiked:boolean,likes:number}){
    
const [hasliked, setHasLiked]=useState(blog.isLiked);
const [likes, setLikes]=useState(blog.likes)
    

    
    return <>
        
        <div onClick={
            
            async ()=>{
                setHasLiked(hasliked=>!hasliked)
                await axios.post("https://backend.aman-lalwani208.workers.dev/api/v1/blog/like/"+blog.id,{},{
                headers:{
                    Authorization:localStorage.getItem('token')
                }
                })
            }
        }>
            {hasliked? <img src={liked} className="w-8" onClick={()=>{
                setLikes(likes=>likes-1)
            }}  ></img> : <img src={like_button} className="w-8" onClick={()=>{
                setLikes(likes=>likes+1)
            }}></img>}
            </div>

            <div className='mt-4'> Liked by {likes} people</div>
    </>
}