import { z } from "zod";

export const CreateFolderSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().nullish(),
  parentId: z.string().nullish().optional(),
});

export const FolderResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullish(),
  userId: z.string(),
  parentId: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CreateFolderInput = z.infer<typeof CreateFolderSchema>;
export type FolderResponse = z.infer<typeof FolderResponseSchema>;
