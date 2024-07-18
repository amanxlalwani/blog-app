import { ChangeEvent } from "react"

export default function InputBox({placeholder,type,name,onChange,required=false}:{placeholder:string,type:string,name:string,onChange:(e:ChangeEvent<HTMLInputElement>)=>void,required?:boolean}){
    return <>
    <label className="font-semibold" htmlFor={name} >{name}</label> <br />
    <input className="w-full my-2.5 rounded-md border-2 border-slate-200 px-2 py-3  placeholder:font-medium placeholder:text-slate-400" type={type} id={name} placeholder={placeholder} required={required} onChange={(e)=>{onChange(e)}}/>
    </>
}
