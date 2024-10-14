import { VoiceNote } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";

export const useLastRecordedMessage = (userId: string) => {
  const [lastMessage, setLastMessage] = useState<VoiceNote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchLastMessage();
  }, [fetchLastMessage]);

  return { lastMessage, isLoading, error, refreshLastMessage: fetchLastMessage };
};
