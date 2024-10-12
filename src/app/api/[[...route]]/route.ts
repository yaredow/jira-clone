import { Hono } from "hono";
import { handle } from "hono/vercel";
import authRoute from "@/features/auth/server/route";

const app = new Hono().basePath("/api");

const routes = app.route("/auth", authRoute);

export const handler = handle(app);

export type AppType = typeof routes;
