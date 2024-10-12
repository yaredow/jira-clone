import { Hono } from "hono";
import { handle } from "hono/vercel";
import authRoute from "@/features/auth/server/route";

const app = new Hono().basePath("/api");

const routes = app.route("/auth", authRoute);

export const GET = handle(app);
export const POST = handle(app);
export const DELETE = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);

export type AppType = typeof routes;
