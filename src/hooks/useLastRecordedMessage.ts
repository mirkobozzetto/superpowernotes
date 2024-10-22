import { VoiceNote } from "@prisma/client";
import { userService } from "@src/services/userService";
import { useCallback, useEffect, useState } from "react";

export const useLastRecordedMessage = (userId: string, shouldRefresh: boolean) => {
  const [lastMessage, setLastMessage] = useState<VoiceNote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLastMessage = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const message = await userService.fetchLastVoiceNote(userId);
      setLastMessage(message);
    } catch (err) {
      console.error("Error fetching last message:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (shouldRefresh) {
      fetchLastMessage();
    }
  }, [shouldRefresh, fetchLastMessage]);

  useEffect(() => {
    if (!lastMessage && userId) {
      fetchLastMessage();
    }
  }, [userId, lastMessage, fetchLastMessage]);

  return { lastMessage, isLoading, error, refreshLastMessage: fetchLastMessage };
};
