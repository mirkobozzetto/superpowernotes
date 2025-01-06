import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@chadcn/components/ui/dialog";
import { VoiceNote } from "@prisma/client";
import { useNoteManagerStore } from "@src/stores/noteManagerStore";
import { FileText, Mic, Plus, Settings } from "lucide-react";
import { useState } from "react";
import { AudioRecorder } from "../recorder/AudioRecorder";
import { ProjectManagementModal } from "./_modals/ProjectManagementModal";

type DashboardActionsProps = {
  isLoading: boolean;
  setEditingNote: (note: VoiceNote | undefined) => void;
  setIsNoteModalOpen: (isOpen: boolean) => void;
  onRecordingComplete: () => void;
};

export const DashboardActions = ({
  isLoading,
  setEditingNote,
  setIsNoteModalOpen,
  onRecordingComplete,
}: DashboardActionsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const { selectedFolderId } = useNoteManagerStore();

  const handleProjectClick = () => {
    setIsProjectModalOpen(true);
    setIsExpanded(false);
  };

  const handleCreateNoteClick = () => {
    const newNote: Partial<VoiceNote> = {
      fileName: null,
      transcription: "",
      tags: [],
      duration: null,
      userId: "", // Sera rempli par le backend
    };
    setEditingNote(newNote as VoiceNote);
    setIsNoteModalOpen(true);
    setIsExpanded(false);
  };

  const handleRecordClick = () => {
    setIsRecordingModalOpen(true);
    setIsExpanded(false);
  };

  const handleRecordingFinish = () => {
    onRecordingComplete();
    setIsRecordingModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 px-4 py-2 border rounded-full w-full font-bold transition-colors duration-200 border-gray-300"
        disabled={isLoading}
      >
        <span className="flex items-center w-4 h-4">
          <Plus />
        </span>
        Actions rapides
      </button>

      {isExpanded && (
        <div className="space-y-4">
          <button
            onClick={handleProjectClick}
            className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 px-4 py-2 border rounded-full w-full font-bold transition-colors duration-200"
            disabled={isLoading}
          >
            <Settings className="w-4 h-4" />
            Gérer les projets
          </button>

          <button
            onClick={handleCreateNoteClick}
            className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 px-4 py-2 border rounded-full w-full font-bold transition-colors duration-200"
            disabled={isLoading}
          >
            <FileText className="w-4 h-4" />
            Créer une note {selectedFolderId ? "dans le projet" : ""}
          </button>

          <button
            onClick={handleRecordClick}
            className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 px-4 py-2 border rounded-full w-full font-bold transition-colors duration-200"
            disabled={isLoading}
          >
            <Mic className="w-4 h-4" />
            {isRecording
              ? "Enregistrement en cours..."
              : `Enregistrer une note${selectedFolderId ? " dans le projet" : ""}`}
          </button>
        </div>
      )}

      <ProjectManagementModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      />

      <Dialog open={isRecordingModalOpen} onOpenChange={setIsRecordingModalOpen}>
        <DialogOverlay className="bg-black/30 backdrop-blur-[2px]" />
        <DialogContent className="w-full max-w-[87.5vw] bg-white rounded-lg border-0 shadow-lg">
          <DialogHeader>
            <DialogTitle>Enregistrer une note vocale</DialogTitle>
            <DialogDescription>
              Enregistrez votre note vocale. Elle sera automatiquement transcrite.
            </DialogDescription>
          </DialogHeader>
          <AudioRecorder
            onRecordingComplete={handleRecordingFinish}
            onRecordingStateChange={setIsRecording}
            inDashboard={true}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
