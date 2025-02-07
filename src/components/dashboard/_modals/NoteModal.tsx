"use client";

import { VoiceNote } from "@prisma/client";
import { MagicButton } from "@src/components/actions/MagicButton";
import { summarizeTranscriptionClient } from "@src/services/_openai/openAISummarizeService";
import React, { useCallback, useEffect, useRef, useState } from "react";
import TagInput from "../TagInput";

type NoteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Partial<VoiceNote>) => void;
  note?: Partial<VoiceNote>;
};

export const NoteModal: React.FC<NoteModalProps> = ({ isOpen, onClose, onSave, note }) => {
  const [editedNote, setEditedNote] = useState<Partial<VoiceNote>>({
    fileName: "",
    transcription: "",
    tags: [],
    duration: 0,
  });
  const [isSummarizing, setIsSummarizing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setEditedNote(note ?? { fileName: "", transcription: "", tags: [], duration: 0 });
    }
  }, [isOpen, note]);

  const handleMagicSummarize = useCallback(async () => {
    if (!editedNote.transcription) {
      alert("Aucune transcription à résumer");
      return;
    }
    setIsSummarizing(true);
    try {
      const summary = await summarizeTranscriptionClient(editedNote.transcription);
      setEditedNote((prev) => ({ ...prev, transcription: summary }));
    } catch (error) {
      console.error("Erreur lors de la synthèse:", error);
      alert("Échec de la synthèse de la note");
    } finally {
      setIsSummarizing(false);
    }
  }, [editedNote.transcription]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!editedNote.fileName || !editedNote.transcription) {
        alert("Veuillez remplir le titre et le contenu");
        return;
      }
      await onSave(editedNote);
    },
    [editedNote, onSave]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setEditedNote((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleTagsChange = useCallback((newTags: string[]) => {
    setEditedNote((prev) => ({ ...prev, tags: newTags }));
  }, []);

  if (!isOpen) return null;

  const isTextNote = editedNote.duration === 0;

  return (
    <div
      className="z-50 fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white shadow-xl mx-4 p-8 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex justify-between items-center">
          <h2 className="font-bold text-2xl text-gray-800">
            {isTextNote
              ? editedNote.id
                ? "Modifier la note"
                : "Créer une note"
              : "Modifier la note"}
          </h2>
          <MagicButton onClick={handleMagicSummarize} isLoading={isSummarizing} />
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            ref={inputRef}
            type="text"
            name="fileName"
            value={editedNote.fileName ?? ""}
            onChange={handleChange}
            placeholder="Titre de la note"
            className="border-gray-300 p-3 border focus:border-transparent rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="transcription"
            value={editedNote.transcription ?? ""}
            onChange={handleChange}
            placeholder={isTextNote ? "Contenu de la note" : "Transcription"}
            className="border-gray-300 p-3 border focus:border-transparent rounded-lg focus:ring-2 focus:ring-blue-500 h-48 resize-none"
          />
          <TagInput tags={editedNote.tags ?? []} onChange={handleTagsChange} />
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="border-gray-300 hover:bg-gray-100 px-6 py-2 border rounded-full text-gray-700 transition-colors duration-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-full text-white transition-colors duration-200"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
