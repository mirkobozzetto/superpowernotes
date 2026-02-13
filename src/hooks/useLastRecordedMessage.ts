import type { VoiceNote } from "@prisma/client";
import { userService } from "@src/services/userService";
import { useCallback, useEffect, useRef, useState } from "react";

export const useLastRecordedMessage = (
  userId: string,
  shouldRefresh: boolean,
  isRecording: boolean
) => {
  const [lastMessage, setLastMessage] = useState<VoiceNote | null>(null);
  const [isNewRecording, setIsNewRecording] = useState(false);
  const lastKnownIdRef = useRef<string | null>(null);
  const isFirstFetchRef = useRef(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLastMessage = useCallback(async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      const message = await userService.fetchLastVoiceNote(userId);
      const messageChanged = message?.id !== lastKnownIdRef.current;

      if (messageChanged) {
        setLastMessage(message);
        lastKnownIdRef.current = message?.id || null;
        setIsNewRecording(true);
        setTimeout(() => setIsNewRecording(false), 2000);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error fetching last message:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const startPolling = useCallback(() => {
    const poll = async () => {
      const found = await fetchLastMessage();
      if (!found) {
        timeoutRef.current = setTimeout(poll, 2000);
      }
    };
    poll();
  }, [fetchLastMessage]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (shouldRefresh && !isRecording) {
      startPolling();
    }
  }, [shouldRefresh, isRecording, startPolling]);

  useEffect(() => {
    if (isFirstFetchRef.current && userId && !isRecording) {
      isFirstFetchRef.current = false;
      fetchLastMessage();
    }
  }, [userId, isRecording, fetchLastMessage]);

  return {
    lastMessage,
    isLoading,
    error,
    refreshLastMessage: fetchLastMessage,
    isNewRecording,
  };
};
