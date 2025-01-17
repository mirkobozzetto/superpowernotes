import { type VoiceNote } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { noteKeys } from "./useNotes";

export const useNotesRefetch = () => {
  const queryClient = useQueryClient();

  return {
    invalidateNotes: async () => {
      await queryClient.invalidateQueries({ queryKey: noteKeys.all });
    },

    setOptimisticNote: (newNote: VoiceNote, folderId: string | null) => {
      queryClient.setQueryData(
        noteKeys.folder(folderId),
        (old: { notes: VoiceNote[] } | undefined) => {
          if (!old) return { notes: [newNote] };
          return {
            ...old,
            notes: [newNote, ...old.notes],
          };
        }
      );
    },
  };
};
