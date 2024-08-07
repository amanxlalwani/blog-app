import { Hono } from "hono";
import { blogRouter } from "./blog";
import { userRouter } from "./user";
import { profileRouter } from "./profile";




const app=new Hono()

app.route('/blog',blogRouter);
app.route('/user',userRouter);
app.route('/profile',profileRouter)

export {app as v1Router}
