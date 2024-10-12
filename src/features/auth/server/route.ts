import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { SigninSchema } from "@/lib/validators";

const app = new Hono().post("/login", zValidator("json", SigninSchema), (c) => {
  return c.json({ success: "ok" });
});

export default app;
