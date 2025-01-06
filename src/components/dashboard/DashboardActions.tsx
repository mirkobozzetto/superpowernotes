import type { VoiceNote } from "@prisma/client";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateNoteButton } from "./CreateNoteButton";
import { ProjectManagementButton } from "./ProjectManagementButton";
import { RecordVoiceButton } from "./RecordVoiceButton";

type DashboardActionsProps = {
  isLoading: boolean;
  setEditingNote: (note: Partial<VoiceNote>) => void;
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

  const handleActionComplete = () => {
    setIsExpanded(false);
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
          <ProjectManagementButton isLoading={isLoading} />
          <CreateNoteButton
            isLoading={isLoading}
            setEditingNote={setEditingNote}
            setIsNoteModalOpen={(isOpen) => {
              setIsNoteModalOpen(isOpen);
              if (isOpen) handleActionComplete();
            }}
          />
          <RecordVoiceButton
            isLoading={isLoading}
            onRecordingComplete={() => {
              onRecordingComplete();
              handleActionComplete();
            }}
          />
        </div>
      )}
    </div>
  );
};
