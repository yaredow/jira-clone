import { z } from "zod";

export const CreateProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Workspace name should be not less than one character"),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
  workspaceId: z.string(),
});

export type CreateProjectData = z.infer<typeof CreateProjectSchema>;
