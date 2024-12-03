import { z } from "zod";

export const CreateFolderSchema = z.object({
  name: z.string().min(1, "Folder name is required"),
  description: z.string().optional(),
  parentId: z.string().optional(),
});

export const FolderResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  parentId: z.string().nullable(),
});

export type CreateFolderInput = z.infer<typeof CreateFolderSchema>;
export type FolderResponse = z.infer<typeof FolderResponseSchema>;
