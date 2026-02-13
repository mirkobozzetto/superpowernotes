import type { VoiceNote } from "@prisma/client";
import { useCallback, useEffect, useRef, useState } from "react";

type UseSyncNotesProps = {
  notes: VoiceNote[];
  fetchNotes: () => Promise<void>;
};

const SYNC_INTERVAL = 3000;

export const useSyncNotes = ({ notes, fetchNotes }: UseSyncNotesProps) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const syncIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestNoteRef = useRef<string | undefined>(undefined);

  const stopSync = useCallback(() => {
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
      syncIntervalRef.current = null;
    }
    setIsSyncing(false);
    setIsProcessing(false);
  }, []);

  const checkForNewNote = useCallback(async () => {
    try {
      setIsProcessing(true);
      await fetchNotes();

      const currentFirstNoteId = notes[0]?.id;
      if (currentFirstNoteId && currentFirstNoteId !== latestNoteRef.current) {
        stopSync();
      }
    } catch (error) {
      console.error("Error checking for new note:", error);
      stopSync();
    } finally {
      setIsProcessing(false);
    }
  }, [fetchNotes, notes, stopSync]);

  const startSync = useCallback(() => {
    if (isSyncing || syncIntervalRef.current) return;

    latestNoteRef.current = notes[0]?.id;
    setIsSyncing(true);

    void checkForNewNote();
    syncIntervalRef.current = setInterval(checkForNewNote, SYNC_INTERVAL);
  }, [checkForNewNote, isSyncing, notes]);

  useEffect(() => {
    if (notes.length > 0 && notes[0].id !== latestNoteRef.current) {
      stopSync();
    }
  }, [notes, stopSync]);

  useEffect(() => {
    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, []);

  return {
    isSyncing,
    isProcessing,
    startSync,
    stopSync,
  };
};
