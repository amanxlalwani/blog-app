import { useState } from "react"
import { useNavigate , Link } from "react-router-dom";

export default function Nav({email}:{email:string}){
    const [openDropdown,setOpenDropDown]=useState(false);
    const navigate=useNavigate(); 
    function toggleDropDown(){
        setOpenDropDown(!openDropdown)
    }
    
    return <>
    <nav className="w-full flex justify-between h-12 items-center px-6 mt-2">
      <Link to="/blogs"> <div className="text-3xl font-bold">Sadhan</div></Link>
 

        <div className="cursor-pointer" onClick={toggleDropDown}>
            <img className="rounded-full h-10" src={"https://ui-avatars.com/api/?background=random&name="+email+"&length=1"} alt="" />
            <div className={`absolute ${openDropdown ? 'block' : 'hidden'}  absolute right-6 bg-slate-100 rounded-lg shadow-md mt-2 space-y-2 w-36 origin-top-right`}>
            <div onClick={()=>{navigate('/myblogs')}} className="px-4 py-2 cursor-pointer text-green-600 ">My Blogs</div>
            <div onClick={()=>{navigate('/createblog')}} className="px-4 py-2 cursor-pointer text-blue-600 ">Write Blog</div>
            <div onClick={()=>{localStorage.removeItem('token')
                navigate('/signin')
            }}  className="px-4 py-2 cursor-pointer text-red-600">Sign Out</div>
     </div>
        </div>
        

    </nav>

    
    </>
}