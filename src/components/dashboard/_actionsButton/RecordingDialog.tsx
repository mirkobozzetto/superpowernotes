import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@chadcn/components/ui/dialog";
import { AudioRecorder } from "@src/components/recorder/AudioRecorder";

type RecordingModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  handleRecordingFinish: () => void;
  setIsRecording: (isRecording: boolean) => void;
};

export const RecordingModal = ({
  isOpen,
  onOpenChange,
  handleRecordingFinish,
  setIsRecording,
}: RecordingModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
  );
};
