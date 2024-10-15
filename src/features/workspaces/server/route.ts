import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { CreateWorkspaceSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, IMAGES_BUCKET_ID, WORKSPACE_ID } from "@/config";
import { ID } from "node-appwrite";

const app = new Hono()
  .get("workspaces", sessionMiddleware, async (c) => {
    const database = c.get("databases");

    const workspaces = await database.listDocuments(DATABASE_ID, WORKSPACE_ID);

    return c.json({ data: workspaces });
  })
  .post(
    "/",
    zValidator("form", CreateWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const database = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");
      const { name, image } = c.req.valid("form");

      let uploadedImageUrl: string | undefined;

      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image,
        );

        const arratBuffer = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id,
        );

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(arratBuffer).toString("base64")}`;
      }

      const workspace = await database.createDocument(
        DATABASE_ID,
        WORKSPACE_ID,
        ID.unique(),
        {
          name,
          userId: user.$id,
          imageUrl: uploadedImageUrl,
        },
      );

      return c.json({ data: workspace });
    },
  );

export default app;
