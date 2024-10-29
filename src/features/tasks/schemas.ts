import { z } from "zod";
import { TaskStatus } from "./types";

export const CreateTaskSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  status: z.nativeEnum(TaskStatus, { required_error: "Status is required" }),
  workspaceId: z.string().trim().min(1, "workspaceId is required"),
  projectId: z.string().trim().min(1, "ProjectId is required"),
  assigneeId: z.string().trim().min(1, "AssigneeId is required"),
  description: z.string().trim().optional(),
  dueDate: z.coerce.date(),
});
