import { VoiceNote } from "@prisma/client";
import { dashboardService } from "@src/services/routes/dashboardService";
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
      const data = await dashboardService.fetchAllNotes();
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
      try {
        const notesArray = await dashboardService.searchNotes(searchParams);
        setNotes(
          notesArray.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
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
      await dashboardService.saveNote(updatedNote);
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
      await dashboardService.deleteNote(deleteNoteId);
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
