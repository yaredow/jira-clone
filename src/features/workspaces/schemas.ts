import { z } from "zod";

export const CreateWorkspaceSchema = z.object({
  name: z.string().trim().min(1, "required"),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((v) => (v === "" ? null : v)),
    ])
    .optional(),
});

export type CreateWorkspaceData = z.infer<typeof CreateWorkspaceSchema>;

export const UpdateWorkspaceSchema = z.object({
  name: z.string().trim().min(1, "Must be 1 or more characters").optional(),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((v) => (v === "" ? null : v)),
    ])
    .optional(),
});

export type UpdateWorkspaceData = z.infer<typeof UpdateWorkspaceSchema>;
