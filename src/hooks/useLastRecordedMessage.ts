import { VoiceNote } from "@prisma/client";
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
  const isPollingRef = useRef<boolean>(false);
  const pollingAttempts = useRef(0);
  const MAX_POLLING_ATTEMPTS = 10;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stopPolling = useCallback(() => {
    isPollingRef.current = false;
    pollingAttempts.current = 0;
    setIsNewRecording(false);
  }, []);

  const fetchLastMessage = useCallback(async () => {
    if (!userId) return undefined;

    try {
      setIsLoading(true);
      const message = await userService.fetchLastVoiceNote(userId);
      const messageChanged = message?.id !== lastKnownIdRef.current;

      if (messageChanged) {
        setLastMessage(message);
        lastKnownIdRef.current = message?.id || null;
        setIsNewRecording(true);
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
    if (isPollingRef.current) return;

    const poll = async () => {
      if (!isPollingRef.current || pollingAttempts.current >= MAX_POLLING_ATTEMPTS) {
        stopPolling();
        return;
      }

      const found = await fetchLastMessage();
      pollingAttempts.current += 1;

      if (!found) {
        setTimeout(poll, 2000);
      } else {
        stopPolling();
      }
    };

    isPollingRef.current = true;
    poll();
  }, [fetchLastMessage, stopPolling]);

  useEffect(() => {
    if (shouldRefresh && !isRecording) {
      startPolling();
    }
    return () => {
      stopPolling();
    };
  }, [shouldRefresh, isRecording, startPolling, stopPolling]);

  return {
    lastMessage,
    isLoading,
    error,
    isNewRecording,
    refreshLastMessage: fetchLastMessage,
  };
};
