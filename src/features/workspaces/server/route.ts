import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { CreateWorkspaceSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, WORKSPACE_ID } from "@/config";
import { ID } from "node-appwrite";

const app = new Hono().post(
  "/",
  zValidator("json", CreateWorkspaceSchema),
  sessionMiddleware,
  async (c) => {
    const database = c.get("databases");
    const user = c.get("user");
    const { name } = c.req.valid("json");

    const workspace = await database.createDocument(
      DATABASE_ID,
      WORKSPACE_ID,
      ID.unique(),
      {
        name,
        userId: user.$id,
      },
    );

    return c.json({ data: workspace });
  },
);

export default app;
