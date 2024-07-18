import { Hono } from "hono";
import { getPrisma } from "./prismaFunction";
import { verify } from "hono/jwt";
import { blogSchema } from "@amanxlalwani/blog-app-common";
const app=new Hono< 
{
    Bindings:{
        DATABASE_URL:string,
        JWT_SECRET:string
    },
    Variables : {
		userid: string
	}
}>()

app.use('/*',async (c,next)=>{
    const prisma=getPrisma(c.env.DATABASE_URL);
    const header=await c.req.header();
    const token=header["authorization"];

    if(!token){
        return c.json({message:"Unauthorized"})
    }
    const finalToken=token.slice(7);

    try{
        const decode=await verify(finalToken,c.env.JWT_SECRET,"HS256")
        if(!decode){
            c.status(401);
          return c.json({message:"Unauthorized"})
        }
        const id:any=decode.id;
        c.set('userid',id);
        await next();
    }
    catch{
      c.status(401);
      return c.json({message:"Unauthorized"})
    } 
})

app.get('/',(c)=>{
    return c.text("Hello from blog");
})

app.post('/',async (c)=>{
    const id = c.get("userid");
    const data=await c.req.json();
    console.log(id);
    const {success,error}=blogSchema.safeParse(data);
    data['authorId']=id;

    if(!success){
        return c.json({
                message:"Invalid Credentials"
        })
    }
    const prisma= getPrisma(c.env.DATABASE_URL);
    const result= await prisma.post.create({data})
    console.log(result);
    return c.json({message:"Post Created Successfully"})
    
})

app.put('/:id',async (c)=>{
    const blogId= c.req.param("id");
    const userId=c.get("userid");
    const data=await c.req.json();
    const prisma= getPrisma(c.env.DATABASE_URL);
    console.log(blogId);
    const result= await prisma.post.update({where:{
     id:blogId,
     authorId:userId
    },data:data});
    return c.json({message:"Blog Updated Successfully"});
})

app.get('/bulk',async (c)=>{
   const prisma=getPrisma(c.env.DATABASE_URL);
   const blogs= await prisma.post.findMany({
    select:{
        id:true,
        title:true,
        content:true,
        publish_date:true,
        author:{
            select:{name:true}
        }
    }
   });
   return c.json({blogs});
}) 

app.get('/:id', async (c)=>{
 const prisma=getPrisma(c.env.DATABASE_URL);
 const blogId=c.req.param("id");
 const blog=await prisma.post.findFirst({where:{id:blogId},select:{id:true,title:true,content:true,publish_date:true,author:{select:{name:true}}}});
 return c.json({blog});
})



export { app as blogRouter}