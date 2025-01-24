import { VoiceNote } from "@prisma/client";
import { useDashboardActions } from "@src/hooks/_useDashboardActions/useDashboardActions";
import { ProjectManagementModal } from "../_modals/ProjectManagementModal";
import { ActionButtons } from "./ActionButtons";
import { ExpandButton } from "./ExpandButton";
import { RecordActionButton } from "./RecordActionButton";
import { RecordingModal } from "./RecordingDialog";

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
      <RecordActionButton
        isLoading={isLoading}
        isRecording={isRecording}
        selectedFolderId={selectedFolderId}
        handleRecordClick={handleRecordClick}
      />

      <ExpandButton onClick={() => setIsExpanded(!isExpanded)} isLoading={isLoading} />

      {isExpanded && (
        <ActionButtons
          isLoading={isLoading}
          handleProjectClick={handleProjectClick}
          handleCreateNoteClick={handleCreateNoteClick}
          isRecording={isRecording}
          selectedFolderId={selectedFolderId}
        />
      )}

      <ProjectManagementModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      />

      <RecordingModal
        isRecordingModalOpen={isRecordingModalOpen}
        setIsRecordingModalOpen={setIsRecordingModalOpen}
        handleRecordingFinish={handleRecordingFinish}
        setIsRecording={setIsRecording}
      />
    </div>
  );
};
