import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { SigninSchema, SignupSchema } from "@/lib/validators";

const app = new Hono()
  .post("/login", zValidator("json", SigninSchema), (c) => {
    const { email, password } = c.req.valid("json");

    return c.json({ email, password });
  })
  .post("/register", zValidator("json", SignupSchema), (c) => {
    const { name, email, password } = c.req.valid("json");

    return c.json({ name, email, password });
  });

export default app;
