import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { CreateTaskSchema } from "../schemas";
import { getMember } from "@/features/members/utils";
import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { Task, TaskStatus } from "../types";
import { createAdminClient } from "@/lib/appwrite";
import { Project } from "@/features/projects/types";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
        projectId: z.string().nullish(),
        assigneeId: z.string().nullish(),
        status: z.nativeEnum(TaskStatus).nullish(),
        search: z.string().nullish(),
        dueDate: z.string().nullish(),
      }),
    ),
    async (c) => {
      const { users } = await createAdminClient();
      const databases = c.get("databases");
      const user = c.get("user");

      const { status, workspaceId, projectId, assigneeId, search, dueDate } =
        c.req.valid("query");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unautherized" }, 404);
      }

      const query = [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ];

      if (projectId) {
        console.log("projectId", projectId);
        query.push(Query.equal("projectId", projectId));
      }

      if (status) {
        console.log("projectId", status);
        query.push(Query.equal("projectId", status));
      }

      if (assigneeId) {
        console.log("assigneeId", assigneeId);
        query.push(Query.equal("assigneeId", assigneeId));
      }

      if (dueDate) {
        console.log("dueDate", dueDate);
        query.push(Query.equal("dueDate", dueDate));
      }

      if (search) {
        console.log("search", search);
        query.push(Query.search("name", search));
      }

      const task = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        query,
      );

      const projectIds = task.documents.map((task) => task.projectId);
      const assigneeIds = task.documents.map((task) => task.assigneeId);

      const projects = await databases.listDocuments<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectIds.length > 0 ? [Query.contains("$id", projectIds)] : [],
      );

      const members = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        assigneeIds.length > 0 ? [Query.contains("$id", assigneeIds)] : [],
      );

      const assignees = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);

          return {
            ...member,
            name: user.name,
            email: user.email,
          };
        }),
      );

      const populatedTask = task.documents.map((task) => {
        const project = projects.documents.find(
          (project) => project.$id === task.projectId,
        );

        const assignee = assignees.find(
          (assignee) => assignee.$id === task.assigneeId,
        );

        return {
          ...task,
          project,
          assignee,
        };
      });
      return c.json({
        data: {
          ...task,
          documents: populatedTask,
        },
      });
    },
  )
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", CreateTaskSchema),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const {
        name,
        status,
        workspaceId,
        projectId,
        assigneeId,
        description,
        dueDate,
      } = c.req.valid("json");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unautherized" }, 404);
      }

      const highestPostionTask = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("workspaceId", workspaceId),
          Query.equal("status", status),
          Query.orderAsc("position"),
          Query.limit(1),
        ],
      );

      const newPosition =
        highestPostionTask.documents.length > 1
          ? highestPostionTask.documents[0].position + 1000
          : 1000;

      const task = await databases.createDocument(
        DATABASE_ID,
        TASKS_ID,
        ID.unique(),
        {
          name,
          status,
          workspaceId,
          projectId,
          assigneeId,
          description,
          dueDate,
          position: newPosition,
        },
      );

      return c.json({ data: task });
    },
  );

export default app;
