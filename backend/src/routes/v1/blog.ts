import { Hono } from "hono";
import { getPrisma } from "./prismaFunction";
import { verify } from "hono/jwt";
import { blogSchema } from "@amanxlalwani/blog-app-common";


const app=new Hono< 
{
    Bindings:{
        DATABASE_URL:string,
        JWT_SECRET:string,
        CLOUDINARY_SECRET:string
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

    const {success,error}=blogSchema.safeParse(data);
    data['authorId']=id;

    if(!success){
        return c.json({
                message:"Invalid Credentials"
        })
    }
    const prisma= getPrisma(c.env.DATABASE_URL);
    const result= await prisma.post.create({data})

    return c.json({message:"Post Created Successfully"})
    
})

app.put('/:id',async (c)=>{
    const blogId= c.req.param("id");
    const userId=c.get("userid");
    const data=await c.req.json();
    const prisma= getPrisma(c.env.DATABASE_URL);

    const result= await prisma.post.update({where:{
     id:blogId,
     authorId:userId
    },data:data});

    if(!result){
        c.status(404)
        return c.json({message:"Blog cannot be updated"})
    }

    return c.json({message:"Blog Updated Successfully"});
})

app.post('/like/:id', async (c)=>{
    const prisma=getPrisma(c.env.DATABASE_URL);
    const blogId=c.req.param("id");
    const userId=c.get("userid");
    const like=await prisma.like.findFirst({where:{postId:blogId,userId:userId}});
    if(!like){
        const makeLike=await prisma.like.create({data:{postId:blogId,userId:userId,has_liked:true}})
    }
    else{
        const update=await prisma.like.update({where:{id:like.id,postId:blogId,userId:userId},data:{has_liked:!like.has_liked}})
    }
    if(like?.has_liked==true)
        return c.json({message:"unliked the blog"});
    return c.json({message:"liked the blog"});
})
   
app.post('/comment/:id', async (c)=>{
    const prisma=getPrisma(c.env.DATABASE_URL);
    const blogId=c.req.param("id");
    const userId=c.get("userid");
    const body= await c.req.json();
    var res={}
    try{
    if(! (body.isChildComment)){
    res = await prisma.comment.create({data:{
    comment:body.comment,
    postId:blogId,
    userId:userId,
    isChildComment:false
    }})
    }
    else{
    res= await prisma.comment.create({data:{
    comment:body.reply,
    postId:blogId,
    userId:userId,
    isChildComment:true,
    parentId:body.parentId    
    }})    
    }
    
    return c.json({
        message:"commented successfully",
        comment:res
    })}
    catch{
    c.status(410)
     return c.json({
        message:"comment unsuccessfully"
     })   
    }
})


app.get('/comments/:id',async (c)=>{
    const prisma=getPrisma(c.env.DATABASE_URL);
    const blogId=c.req.param("id");
    const comments= await prisma.comment.findMany({
        where:{
            postId:blogId,
            isChildComment:false
        },
        select:{
            id:true,
            comment:true,
            user:{
                select:{
                    email:true
                }
            }
        }
    })

    return c.json({
        comments
    })
}
)



app.get('/replies/:id',async (c)=>{
    const prisma=getPrisma(c.env.DATABASE_URL);
    const parentId=c.req.param("id");
    const replies= await prisma.comment.findMany({
        where:{
            parentId
        },
        select:{
            id:true,
            comment:true,
            user:{
                select:{
                    email:true
                }
            }
        }
    })

    return c.json({
        replies
    })
}
)


 

app.delete('/:id',async (c)=>{
    const blogId= c.req.param("id");
    const userId=c.get("userid");
    
    const prisma= getPrisma(c.env.DATABASE_URL);
    
    const result= await prisma.post.delete({where:{
     id:blogId,
     authorId:userId}}
    );

    if(!result){
        c.status(404)
        return c.json({message:"Blog cannot be deleted"})
    }

    return c.json({message:"Blog Deleted Successfully"});
})

app.get('/explore/bulk',async (c)=>{
   const prisma=getPrisma(c.env.DATABASE_URL);
   const blogs= await prisma.post.findMany({
    select:{
        id:true,
        title:true,
        content:true,
        publish_date:true,
        author:{
            select:{name:true }
        },
        likes:{
            select:{
                userId:true,
                has_liked:true
            }
        }
    }
   });
   
   return c.json({blogs});
}) 


app.get('/subscriptions/bulk',async (c)=>{
    const prisma=getPrisma(c.env.DATABASE_URL);
    const id = c.get("userid");
    const users= await prisma.subscribe.findMany({
        where:{
            subscriber_id:id
        },
        select:{
         user_id:true,
         }
     })

     const subscribed_to=users.map(ele=>{
        return ele.user_id 
     })

     const blogs= await prisma.post.findMany({
        where:{
            authorId:{
                in:subscribed_to 
            }
        },
        select:{
            id:true,
            title:true,
            content:true,
            publish_date:true,
            author:{
                select:{name:true }
            },
            likes:{
                select:{
                    userId:true,
                    has_liked:true
                }
            }
        }
       });


    
    return c.json({blogs});
 }) 
 


app.get('/myblogs',async (c) =>{
    const prisma=getPrisma(c.env.DATABASE_URL);
    const userId=c.get("userid");
    const blogs=await prisma.post.findMany({
       where:{
           authorId:userId
       },
       select:{
           id:true,
           title:true,
           content:true,
           publish_date:true,
           author:{
           select:{name:true}
           }
       }
       })
       return c.json({
       blogs
    })   
   })
   
   app.get('/search',async (c)=>{
    const filter=c.req.query("filter")||"";
    console.log(filter);
    if(!(filter?.length>0)){return c.json({blogs:[]})}; 
    const prisma=getPrisma(c.env.DATABASE_URL);
    const blogs= await prisma.post.findMany({
     select:{
         id:true,
         title:true,
         content:true,
         publish_date:true,
         author:{
             select:{name:true }
         },
         likes:{
             select:{
                 userId:true,
                 has_liked:true
             }
         }
     },
     where:{
         OR:[
          {title:{contains:filter,mode:"insensitive"}},
          {content:{contains:filter,mode:"insensitive"}},
          {author:{name:{contains:filter,mode:"insensitive"}}},
          {author:{email:{contains:filter,mode:"insensitive"}}}  
         ]
     }
    });
    
    return c.json({blogs});
 }) 

   
   


app.get('/:id', async (c)=>{
 const prisma=getPrisma(c.env.DATABASE_URL);
 const blogId=c.req.param("id");
 const blog=await prisma.post.findFirst({where:{id:blogId},select:{id:true,title:true,content:true,publish_date:true,author:{select:{id:true,name:true,bio:true,User:{
    select:{
        id:true,
        user_id:true,
        subscriber_id:true
    }
 }}},
    likes:{
        select:{
            userId:true,
            has_liked:true
        }
    }
}});
 return c.json({blog});
})




export { app as blogRouter}