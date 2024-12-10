export type NoteMoveServiceResponse<T> = {
  data?: T;
  error?: { message: string };
};

export const noteMoveService = {
  async moveNote(noteId: string, folderId: string | null): Promise<NoteMoveServiceResponse<void>> {
    try {
      const response = await fetch(`/api/notes/${noteId}/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folderId }),
      });

      if (!response.ok) {
        const error = await response.json();
        return { error: { message: error.message || "Failed to move note" } };
      }

      return {};
    } catch (error) {
      return {
        error: { message: error instanceof Error ? error.message : "Failed to move note" },
      };
    }
  },
};
