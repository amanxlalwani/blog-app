import { Hono } from "hono";
import { getPrisma } from "./prismaFunction";
import { verify } from "hono/jwt";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userid: string;
  };
}>();

app.use("/*", async (c, next) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const header = await c.req.header();
  const token = header["authorization"];

  if (!token) {
    return c.json({ message: "Unauthorized" });
  }
  const finalToken = token.slice(7);

  try {
    const decode = await verify(finalToken, c.env.JWT_SECRET, "HS256");
    if (!decode) {
      c.status(401);
      return c.json({ message: "Unauthorized" });
    }
    const id: any = decode.id;
    c.set("userid", id);
    await next();
  } catch {
    c.status(401);
    return c.json({ message: "Unauthorized" });
  }
});

app.get("/", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const userId = c.get("userid");
  const profile = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: { name: true, email: true, bio: true },
  });
  return c.json({ profile });
});

app.put("/", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const userId = c.get("userid");
  const body = await c.req.json();
  try {
    const profile = await prisma.user.update({
      where: { id: userId },
      data: body,
    });
    return c.json({ message: "Profile Updated" });
  } catch (err) {
    c.status(400);
    return c.json({ message: "Something went wrong" });
  }
});

app.put("/changepassword", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const userId = c.get("userid");
  const body = await c.req.json();

  try {
    const profile = await prisma.user.update({
      where: { id: userId },
      data: { password: body.password },
    });
    return c.json({ message: "Password Updated" });
  } catch (err) {
    c.status(400);
    return c.json({ message: "Something went wrong" });
  }
});

export { app as profileRouter };
