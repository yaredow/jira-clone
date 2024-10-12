import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { SigninSchema } from "@/lib/validators";

const app = new Hono().post("/login", zValidator("json", SigninSchema), (c) => {
  const { email, password } = c.req.valid("json");
  console.log(email, password);

  return c.json({ email, password });
});

export default app;
