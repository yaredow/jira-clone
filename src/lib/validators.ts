import { z } from "zod";

export const SigninSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(256),
});

export type SigninData = z.infer<typeof SigninSchema>;

export const SignupSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email(),
  password: z.string().min(8).max(256),
});

export type SignupData = z.infer<typeof SignupSchema>;
