import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@chadcn/components/ui/dialog";
import { VoiceNote } from "@prisma/client";
import { useDashboardActions } from "@src/hooks/_useDashboardActions/useDashboardActions";
import { FileText, Mic, Plus, Settings } from "lucide-react";
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
  const {
    isExpanded,
    setIsExpanded,
    isProjectModalOpen,
    setIsProjectModalOpen,
    isRecordingModalOpen,
    setIsRecordingModalOpen,
    isRecording,
    setIsRecording,
    selectedFolderId,
    handleProjectClick,
    handleCreateNoteClick,
    handleRecordClick,
    handleRecordingFinish,
  } = useDashboardActions({
    setEditingNote,
    setIsNoteModalOpen,
    onRecordingComplete,
  });

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
