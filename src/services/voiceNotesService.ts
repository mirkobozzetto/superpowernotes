import type { VoiceNote } from "@generated/prisma/client";
import type {
  SearchParamsType,
  VoiceNoteUpdateInput,
} from "@src/validations/routes/voiceNoteRoutes";
import { voiceNotesApi } from "./routes/voiceNotesApi";

export type NotesWithTimeLimit = {
  notes: VoiceNote[];
  remainingTime?: number;
  hasMore?: boolean;
  total?: number;
};

export type SearchNotesParams = SearchParamsType & {
  folderId?: string | null;
};

export type GetNotesOptions = {
  skip?: number;
  take?: number;
};

export const voiceNotesService = {
  async getAllNotes(
    folderIdOrOptions?: string | null | GetNotesOptions
  ): Promise<NotesWithTimeLimit> {
    try {
      if (typeof folderIdOrOptions === "string" || folderIdOrOptions === null) {
        const { voiceNotes, remainingTime } = await voiceNotesApi.fetchAll(folderIdOrOptions);
        return {
          notes: this.sortNotesByDate(voiceNotes),
          remainingTime,
        };
      }

      const options = folderIdOrOptions || {};
      const { voiceNotes, remainingTime, hasMore, total } = await voiceNotesApi.fetchAll(
        null,
        options.skip,
        options.take
      );

      return {
        notes: this.sortNotesByDate(voiceNotes),
        remainingTime,
        hasMore,
        total,
      };
    } catch (error) {
      console.error("Error in getAllNotes", error);
      throw new Error("Failed to fetch notes", { cause: error });
    }
  },

  async searchNotes(params: SearchNotesParams): Promise<VoiceNote[]> {
    try {
      const notes = await voiceNotesApi.search(params);
      return this.sortNotesByDate(notes);
    } catch (error) {
      console.error("Error in searchNotes", error);
      throw new Error("Failed to search notes", { cause: error });
    }
  },

  async saveNote(note: VoiceNoteUpdateInput & { id?: string }): Promise<VoiceNote> {
    try {
      return await voiceNotesApi.save(note);
    } catch (error) {
      console.error("Error in saveNote", error);
      throw new Error("Failed to save note", { cause: error });
    }
  },

  async deleteNote(noteId: string): Promise<void> {
    try {
      await voiceNotesApi.delete(noteId);
    } catch (error) {
      console.error("Error in deleteNote", error);
      throw new Error("Failed to delete note", { cause: error });
    }
  },

  sortNotesByDate(notes: VoiceNote[]): VoiceNote[] {
    return [...notes].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async checkForNewNoteAfter(referenceNoteId: string): Promise<boolean> {
    try {
      const { voiceNotes } = await voiceNotesApi.fetchAll();
      return voiceNotes.length > 0 && voiceNotes[0].id !== referenceNoteId;
    } catch {
      return false;
    }
  },
};
