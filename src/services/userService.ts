import { User, VoiceNote } from "@prisma/client";

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

  async fetchAllUsers(): Promise<User[]> {
    const response = await fetch("/api/users");
    if (!response.ok) throw new Error("Failed to fetch users");
    return response.json();
  },

  async updateUserData(userId: string, data: Partial<User>): Promise<User> {
    const response = await fetch(`/api/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update user: ${response.status} ${errorText}`);
    }

    return response.json();
  },

  async deleteUser(userId: string): Promise<void> {
    const response = await fetch(`/api/users/${userId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete user: ${response.status} ${errorText}`);
    }
  },
};
