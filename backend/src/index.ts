import { Hono } from "hono";
import { v1Router } from "./routes/v1/main";
import { cors } from "hono/cors";
const app = new Hono();

app.use("/*", cors());
app.route("/api/v1", v1Router);

app.fire();

export default app;
