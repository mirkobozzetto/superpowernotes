import { FileText, Mic, Settings } from "lucide-react";

type ActionButtonsProps = {
  isLoading: boolean;
  handleProjectClick: () => void;
  handleCreateNoteClick: () => void;
  handleRecordClick: () => void;
  isRecording: boolean;
  selectedFolderId: string | null;
};

export const ActionButtons = ({
  isLoading,
  handleProjectClick,
  handleCreateNoteClick,
  handleRecordClick,
  isRecording,
  selectedFolderId,
}: ActionButtonsProps) => {
  return (
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
  );
};
