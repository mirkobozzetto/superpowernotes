import { VoiceNote } from "@prisma/client";

type FetchNotesResponse = {
  voiceNotes: VoiceNote[];
  remainingTime?: number;
};

export const dashboardService = {
  async fetchAllNotes(): Promise<FetchNotesResponse> {
    const response = await fetch("/api/voice-notes");
    if (!response.ok) {
      console.error("Error fetching notes", { status: response.status });
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async searchNotes(searchParams: Record<string, string>): Promise<VoiceNote[]> {
    const queryParams = new URLSearchParams(searchParams);
    const response = await fetch(`/api/notes?${queryParams}`);
    if (!response.ok) {
      console.error("Error searching notes", { status: response.status });
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : data.voiceNotes;
  },

  async saveNote(noteData: Partial<VoiceNote>): Promise<VoiceNote> {
    const url = noteData.id ? `/api/voice-notes/${noteData.id}` : "/api/notes";
    const method = noteData.id ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(noteData),
    });

    if (!response.ok) {
      console.error("Error saving note", { status: response.status });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async deleteNote(noteId: string): Promise<void> {
    const response = await fetch(`/api/voice-notes/${noteId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      console.error("Error deleting note", { noteId, status: response.status });
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  },
};
