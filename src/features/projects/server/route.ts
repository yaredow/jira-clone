import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID } from "@/config";
import { getMember } from "@/features/members/utils";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { CreateProjectSchema, UpdateProjectSchema } from "../schemas";
import { MemberRole } from "@/features/members/types";
import { Project } from "../types";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");

      const { workspaceId } = c.req.valid("query");

      if (!workspaceId) {
        return c.json({ error: "Missing workspaceId" }, 400);
      }

      const member = await getMember({
        workspaceId,
        userId: user.$id,
        databases,
      });

      if (!member) {
        return c.json({ error: "Unautherized" }, 401);
      }

      const projects = await databases.listDocuments(DATABASE_ID, PROJECTS_ID, [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ]);

      return c.json({ data: projects });
    },
  )
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", CreateProjectSchema),
    async (c) => {
      try {
        const database = c.get("databases");
        const storage = c.get("storage");
        const user = c.get("user");
        const { name, image, workspaceId } = c.req.valid("form");
        console.log({ name, image, workspaceId });

        const member = await getMember({
          workspaceId,
          userId: user.$id,
          databases: database,
        });

        if (!member) {
          return c.json({ error: "Unautherized" }, 401);
        }

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

        const project = await database.createDocument(
          DATABASE_ID,
          PROJECTS_ID,
          ID.unique(),
          {
            name,
            imageUrl: uploadedImageUrl,
            workspaceId,
          },
        );

        return c.json({ data: project });
      } catch (error) {
        console.error(error);
        return c.json({ error: error }, 500);
      }
    },
  )
  .patch(
    "/:projectId",
    sessionMiddleware,
    zValidator("form", UpdateProjectSchema),
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { projectId } = c.req.param();
      const { name, image } = c.req.valid("form");

      const existingProject = await databases.getDocument<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectId,
      );

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId: existingProject.workspaceId,
      });

      if (!member) {
        return c.json({ error: "Unautherized" }, 401);
      }

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

      const project = await databases.updateDocument(
        DATABASE_ID,
        PROJECTS_ID,
        projectId,
        {
          name,
          imageUrl: uploadedImageUrl,
        },
      );

      return c.json({ data: project });
    },
  );

export default app;
