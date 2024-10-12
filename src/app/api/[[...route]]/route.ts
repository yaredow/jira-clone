import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api");

app.get("/", (c) => {
  return c.json({ message: "Hello World" });
});

app.get("/project/:projectId", (c) => {
  const projectId = c.req.param("");
  return c.json({ projectId: projectId });
});

export const GET = handle(app);
