import type { VoiceNote } from "@prisma/client";
import { voiceNotesService } from "@src/services/voiceNotesService";
import type { SearchParamsType } from "@src/validations/routes/voiceNoteRoutes";
import { useCallback, useEffect, useState } from "react";

export function useDashboard() {
  const [notes, setNotes] = useState<VoiceNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParamsType>({
    tags: "",
    startDate: "",
    endDate: "",
    keyword: "",
  });

  const fetchAllNotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { notes: fetchedNotes } = await voiceNotesService.getAllNotes();
      setNotes(fetchedNotes);
    } catch (error) {
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
        const searchedNotes = await voiceNotesService.searchNotes(searchParams);
        setNotes(searchedNotes);
      } catch (error) {
        setError("Search failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [searchParams]
  );

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSaveNote = useCallback(
    async (updatedNote: Partial<VoiceNote>) => {
      setIsLoading(true);
      setError(null);
      try {
        await voiceNotesService.saveNote(updatedNote);
        await fetchAllNotes();
      } catch (error) {
        setError("Failed to save note. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAllNotes]
  );

  const handleDelete = useCallback(async (noteId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await voiceNotesService.deleteNote(noteId);
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
    } catch (error) {
      setError("Failed to delete note. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

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
