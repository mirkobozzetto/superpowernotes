import { VoiceNote } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";

export const useLastRecordedMessage = (userId: string, shouldRefresh: boolean) => {
  const [lastMessage, setLastMessage] = useState<VoiceNote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLastMessage = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/voice-notes?userId=${userId}&limit=1`);
      if (!response.ok) {
        throw new Error("Failed to fetch last message");
      }
      const data = await response.json();
      setLastMessage(data.voiceNotes[0] || null);
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
