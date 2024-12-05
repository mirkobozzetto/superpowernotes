import type { VoiceNote } from "@prisma/client";
import type {
  SearchParamsType,
  VoiceNoteUpdateInput,
} from "@src/validations/routes/voiceNoteRoutes";

export type FetchNotesResponse = {
  voiceNotes: VoiceNote[];
  remainingTime?: number;
};

export const voiceNotesApi = {
  async fetchAll(folderId?: string | null): Promise<FetchNotesResponse> {
    const url = folderId ? `/api/folders/${folderId}/notes` : "/api/voice-notes";

    const response = await fetch(url);
    if (!response.ok) {
      console.error("Error fetching notes", { status: response.status });
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async search(params: SearchParamsType & { folderId?: string | null }): Promise<VoiceNote[]> {
    const queryParams = new URLSearchParams(params as Record<string, string>);
    const response = await fetch(`/api/notes?${queryParams}`);
    if (!response.ok) {
      console.error("Error searching notes", { status: response.status });
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : data.voiceNotes;
  },

  async save(note: VoiceNoteUpdateInput & { id?: string }): Promise<VoiceNote> {
    const url = note.id ? `/api/voice-notes/${note.id}` : "/api/notes";
    const method = note.id ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note),
    });

    if (!response.ok) {
      console.error("Error saving note", { status: response.status });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async delete(noteId: string): Promise<void> {
    const response = await fetch(`/api/voice-notes/${noteId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      console.error("Error deleting note", { noteId, status: response.status });
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  },
};
