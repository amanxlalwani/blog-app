import { z } from "zod";

export const signinSchema=z.object({
    email:z.string(),
    password:z.string()
})

export const signupSchema=z.object({
    email:z.string(),
    password:z.string().min(8,"Password should contain atleast 8 characters"),
    name:z.string()
})


export const blogSchema=z.object({
    title:z.string(),
   content:z.string(), 
    published:z.boolean().optional(),
})

export type blogType= z.infer<typeof blogSchema>
export type signupType=z.infer<typeof signupSchema>
export type signinType=z.infer<typeof signinSchema>


