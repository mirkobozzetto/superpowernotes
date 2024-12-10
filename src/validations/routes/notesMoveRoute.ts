import { z } from "zod";

export const MoveFolderSchema = z
  .object({
    folderId: z.string().nullable(),
  })
  .refine((data) => data.folderId !== undefined, {
    message: "folderId must be provided (can be null to remove from folder)",
  });

export type MoveFolderInput = z.infer<typeof MoveFolderSchema>;
