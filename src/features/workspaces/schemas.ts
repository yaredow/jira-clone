import { z } from "zod";

export const CreateWorkspaceSchema = z.object({
  name: z.string().trim().min(1, "required"),
});

export type CreateWorkspaceData = z.infer<typeof CreateWorkspaceSchema>;
