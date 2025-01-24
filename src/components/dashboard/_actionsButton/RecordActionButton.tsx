import { Mic } from "lucide-react";

type RecordActionButtonProps = {
  isLoading: boolean;
  isRecording: boolean;
  selectedFolderId: string | null;
  handleRecordClick: () => void;
};

export const RecordActionButton = ({
  isLoading,
  isRecording,
  selectedFolderId,
  handleRecordClick,
}: RecordActionButtonProps) => {
  return (
    <button
      onClick={handleRecordClick}
      className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 px-4 py-2 border rounded-full w-full font-bold transition-colors duration-200 mb-4"
      disabled={isLoading}
      aria-label={isRecording ? "Arrêter l'enregistrement" : "Démarrer l'enregistrement"}
    >
      <Mic className="w-4 h-4" />
      {isRecording
        ? "Enregistrement en cours..."
        : `Enregistrer une note${selectedFolderId ? "" : ""}`}
    </button>
  );
};
