import type { User, VoiceNote } from "@prisma/client";
import {
  LastVoiceNoteSchema,
  RemainingTimeSchema,
  UserDataSchema,
} from "@src/validations/services/userServiceSchemas";

export const userService = {
  async fetchRemainingTimeForUser(userId: string): Promise<number> {
    try {
      const response = await fetch(`/api/users/${userId}/usage`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const validated = RemainingTimeSchema.parse(data);
      return validated.currentPeriodRemainingTime;
    } catch (error) {
      console.error("Failed to fetch remaining time:", error);
      throw error;
    }
  },

  async fetchLastVoiceNote(userId: string): Promise<VoiceNote | null> {
    try {
      const response = await fetch(`/api/voice-notes?userId=${userId}&limit=1`);
      if (!response.ok) {
        throw new Error("Failed to fetch last message");
      }
      const data = await response.json();
      const validated = LastVoiceNoteSchema.parse(data);
      return validated.voiceNotes[0] || null;
    } catch (error) {
      console.error("Failed to fetch last voice note:", error);
      throw error;
    }
  },

  async fetchAllUsers(): Promise<User[]> {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch users:", error);
      throw error;
    }
  },

  async updateUserData(userId: string, data: Partial<User>): Promise<User> {
    try {
      const validatedData = UserDataSchema.parse(data);

      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update user: ${response.status} ${errorText}`);
      }

      const updatedUser = await response.json();
      return updatedUser;
    } catch (error) {
      console.error("Failed to update user:", error);
      throw error;
    }
  },

  async deleteUser(userId: string): Promise<void> {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete user: ${response.status} ${errorText}`);
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      throw error;
    }
  },
};
