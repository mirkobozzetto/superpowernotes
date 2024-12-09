import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@chadcn/components/ui/dialog";
import { useNoteManagerStore } from "@src/stores/noteManagerStore";
import { Mic } from "lucide-react";
import { useState } from "react";
import { AudioRecorder } from "../recorder/AudioRecorder";

type RecordVoiceButtonProps = {
  isLoading: boolean;
  onRecordingComplete: () => void;
};

export const RecordVoiceButton = ({ isLoading, onRecordingComplete }: RecordVoiceButtonProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { selectedFolderId } = useNoteManagerStore();

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const handleRecordingStateChange = (recording: boolean) => {
    setIsRecording(recording);
  };

  const handleRecordingFinish = () => {
    onRecordingComplete();
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 px-4 py-2 border rounded-full w-full font-bold transition-colors duration-200"
        disabled={isLoading}
      >
        <Mic className="w-4 h-4" />
        {isRecording
          ? "Enregistrement en cours..."
          : `Enregistrer une note${selectedFolderId ? " dans le projet" : ""}`}
      </button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogOverlay className="bg-black/30 backdrop-blur-[2px]" />
        <DialogContent className="w-full max-w-[66vw] bg-white rounded-lg border-0 shadow-lg">
          <DialogHeader>
            <DialogTitle>Enregistrer une note vocale</DialogTitle>
            <DialogDescription>
              Enregistrez votre note vocale. Elle sera automatiquement transcrite.
            </DialogDescription>
          </DialogHeader>
          <AudioRecorder
            onRecordingComplete={handleRecordingFinish}
            onRecordingStateChange={handleRecordingStateChange}
            inDashboard={true}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
