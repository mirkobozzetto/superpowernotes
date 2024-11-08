import { VoiceNote } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";

export type SearchParams = {
  tags: string;
  startDate: string;
  endDate: string;
  keyword: string;
};

export function useDashboard() {
  const [notes, setNotes] = useState<VoiceNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    tags: "",
    startDate: "",
    endDate: "",
    keyword: "",
  });

  const fetchAllNotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/voice-notes");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setNotes(
        data.voiceNotes.sort(
          (a: VoiceNote, b: VoiceNote) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
    } catch (error) {
      console.error("Error fetching notes:", error);
      setError("Failed to fetch notes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllNotes();
  }, [fetchAllNotes]);

  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);
      const queryParams = new URLSearchParams({ ...searchParams });
      try {
        const response = await fetch(`/api/notes?${queryParams}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const notesArray = Array.isArray(data) ? data : data.voiceNotes;
        if (Array.isArray(notesArray)) {
          setNotes(
            notesArray.sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
          );
        } else {
          throw new Error("Received data is not in the expected format");
        }
      } catch (error) {
        console.error("Error during search:", error);
        setError("Search failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [searchParams]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveNote = async (updatedNote: Partial<VoiceNote>) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = updatedNote.id ? `/api/voice-notes/${updatedNote.id}` : "/api/voice-notes";
      const method = updatedNote.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedNote),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Après avoir sauvegardé la note, rechargez toutes les notes
      await fetchAllNotes();
    } catch (error) {
      console.error("Error saving note:", error);
      setError("Failed to save note. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (deleteNoteId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/voice-notes/${deleteNoteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== deleteNoteId));
    } catch (error) {
      console.error("Error deleting note:", error);
      setError("Failed to delete note. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    notes,
    isLoading,
    error,
    searchParams,
    handleSearch,
    handleInputChange,
    handleSaveNote,
    handleDelete,
    fetchAllNotes,
  };
}
