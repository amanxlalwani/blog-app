import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { env } from "hono/adapter";
import { getPrisma } from "./prismaFunction";
import { jwt, sign, verify } from "hono/jwt";
import { use } from "hono/jsx";
import { signinSchema, signupSchema } from "@amanxlalwani/blog-app-common";
import { Redis } from "@upstash/redis/cloudflare";
import otpGenerator from "otp-generator";
import { Resend } from "resend";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

app.get("/me", async (c) => {
  const token = await c.req.header()["authorization"];
  const finalToken = token.slice(7);
  try {
    const user = await verify(finalToken, c.env.JWT_SECRET);
    return c.json({ success: true, user });
  } catch {
    return c.json({ success: false });
  }
});

app.post("/subscribe", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const data = await c.req.json();
  try {
    const res = await prisma.subscribe.create({
      data: {
        subscriber_id: data.subscriber_id,
        user_id: data.user_id,
      },
    });

    return c.json({
      status: 200,
      message: "Subscribed",
      subscribeId: res.id,
    });
  } catch {
    return c.json({
      status: 400,
    });
  }
});

app.post("/unsubscribe", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const data = await c.req.json();
  try {
    const res = await prisma.subscribe.delete({
      where: {
        id: data.subscribeId,
        subscriber_id: data.subscriber_id,
        user_id: data.user_id,
      },
    });

    return c.json({
      status: 200,
      message: "Unsubscribed",
    });
  } catch {
    return c.json({
      status: 400,
    });
  }
});

app.post("/signin", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const data = await c.req.json();
  //zod validation
  const { success, error } = signinSchema.safeParse(data);
  if (!success) {
    c.status(403);
    return c.json({ message: error });
  }

  const user = await prisma.user.findFirst({ where: { email: data.email } });

  if (!user) {
    c.status(404);
    return c.json({ message: "User not found" });
  }

  if (user.password != data.password) {
    c.status(401);
    return c.json({ message: "Invalid Password" });
  }
  const payload = {
    id: user.id,
    email: user.email,
  };

  const token = await sign(payload, c.env.JWT_SECRET, "HS256");

  return c.json({ token: `Bearer ${token}` });
});

app.post("/signup", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const data = await c.req.json();

  //zod validation
  const { success, error } = signupSchema.safeParse(data);
  if (!success) {
    c.status(401);
    return c.json({
      message: "Invalid Credentials",
    });
  }

  const existingUser = await prisma.user.findFirst({
    where: { email: data.email },
  });
  if (existingUser) {
    c.status(401);
    return c.json({ message: "Username has been already taken!" });
  }

  const result = await prisma.user.create({ data });
  const payload = {
    id: result.id,
    email: result.email,
  };
  const secret = c.env.JWT_SECRET;

  const token = await sign(payload, secret, "HS256");

  return c.json({ token: `Bearer ${token}` });
});

export { app as userRouter };
