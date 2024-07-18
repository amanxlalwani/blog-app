import { Hono } from "hono";
import { blogRouter } from "./blog";
import { userRouter } from "./user";




const app=new Hono()

app.route('/blog',blogRouter);
app.route('/user',userRouter);

export {app as v1Router}
