import { z } from "zod";
import { TaskStatus } from "./types";

export const CreateTaskSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  status: z.nativeEnum(TaskStatus, { required_error: "Status is required" }),
  workspaceId: z.string().trim().min(1, "Workspace ID is required"),
  projectId: z.string().trim().min(1, "Project ID is required"),
  dueDate: z.coerce.date(),
  assigneeId: z.string().trim().min(1, "Assignee ID is required"),
  description: z
    .string()
    .optional()
    .transform((val) => val?.trim() || undefined),
});

export type CreateTaskData = z.infer<typeof CreateTaskSchema>;
