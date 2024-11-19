
import { useNavigate } from "react-router-dom";


function dateExtract(publish_date:string){
    return publish_date.slice(0,10);
}

export default function BlogCard(blog:{id:string,title:string,content:string,publish_date:string,author:{name:string},likes:number}){

const navigate=useNavigate()

    return <>
        <hr className="border mt-10 border-gray-200" />
        <div onClick={()=>{navigate("/blog/"+blog.id)}} className="mt-12 w-full cursor-pointer break-words  ">
            <div className="text-base">{blog.author.name} · <span className="text-gray-500">{dateExtract(blog.publish_date)}</span> </div>
            <div className="text-2xl font-bold ">{blog.title}</div>
            <div className="multiLineLabel w-full">
            <div className=" max-w-full textMaxLine  ">
               {blog.content}
            </div>
            <div className="mt-4 font-semibold">{blog.likes} People liked this blog</div>
            </div>
        </div>
    
    </>
}