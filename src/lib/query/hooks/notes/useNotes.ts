import { voiceNotesService } from "@src/services/voiceNotesService";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";

export const noteKeys = {
  all: ["notes"] as const,
  folder: (folderId: string | null) => [...noteKeys.all, "folder", folderId] as const,
  detail: (noteId: string) => [...noteKeys.all, "detail", noteId] as const,
};

export const useNotes = (selectedFolderId: string | null) => {
  const lastNotesCountRef = useRef<number>(0);
  const shouldContinuePollingRef = useRef(false);

  const result = useQuery({
    queryKey: noteKeys.folder(selectedFolderId),
    queryFn: () => voiceNotesService.getAllNotes(selectedFolderId),
    refetchInterval: () => {
      if (shouldContinuePollingRef.current) {
        return 3500;
      }
      return false;
    },
  });

  const startPolling = () => {
    shouldContinuePollingRef.current = true;
    result.refetch();
  };

  const stopPolling = () => {
    shouldContinuePollingRef.current = false;
  };

  const currentNotes = result.data?.notes || [];
  if (currentNotes.length > lastNotesCountRef.current) {
    lastNotesCountRef.current = currentNotes.length;
    stopPolling();
  }

  return {
    isLoading: result.isLoading,
    startPolling,
    notes: currentNotes,
  };
};
