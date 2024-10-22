import { VoiceNote } from "@prisma/client";

export const userService = {
  async fetchRemainingTimeForUser(userId: string): Promise<number> {
    const response = await fetch(`/api/users/${userId}/usage`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.currentPeriodRemainingTime;
  },

  async fetchLastVoiceNote(userId: string): Promise<VoiceNote | null> {
    const response = await fetch(`/api/voice-notes?userId=${userId}&limit=1`);
    if (!response.ok) {
      throw new Error("Failed to fetch last message");
    }
    const data = await response.json();
    return data.voiceNotes[0] || null;
  },
};
