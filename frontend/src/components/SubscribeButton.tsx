export default function SubscribeButton({title,onClick}:{title:string,onClick:()=>void}){
    return <>
    <button className={"  w-full rounded-full  text-white px-2 py-3 mt-4 font-semibold bg-gradient-to-br from-gray-500 via-zinc-700  to-black"} onClick={()=>{onClick()}}>{title}</button>
    </>
    }