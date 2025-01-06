import { Prisma, VoiceNote } from "@prisma/client";

export type CreateNoteInput = Prisma.VoiceNoteCreateInput;

export const noteCreationService = {
  createEmptyNote(): Partial<VoiceNote> {
    return {
      fileName: null,
      transcription: "",
      tags: [],
      duration: null,
      userId: "",
    };
  },

  createNoteWithFolderConnection(
    noteData: Partial<VoiceNote>,
    folderId: string
  ): Prisma.VoiceNoteCreateInput {
    return {
      ...noteData,
      transcription: noteData.transcription || "",
      folders: {
        create: {
          folder: {
            connect: { id: folderId },
          },
        },
      },
      user: {
        connect: { id: noteData.userId || "" },
      },
    };
  },
};
