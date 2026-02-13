import type { VoiceNote } from "@prisma/client";
import { useDashboardActions } from "@src/hooks/_useDashboardActions/useDashboardActions";
import { ProjectManagementModal } from "../_modals/ProjectManagementModal";
import { CreateNoteButton } from "../CreateNoteButton";
import { ActionButtons } from "./ActionButtons";
import { ExpandButton } from "./ExpandButton";
import { RecordActionButton } from "./RecordActionButton";
import { RecordingModal } from "./RecordingDialog";

type DashboardActionsProps = {
  isLoading: boolean;
  setEditingNote: (note: VoiceNote | undefined) => void;
  setIsNoteModalOpen: (isOpen: boolean) => void;
  onRecordingComplete: () => void;
  searchForm?: React.ReactNode;
};

export const DashboardActions = ({
  isLoading,
  setEditingNote,
  setIsNoteModalOpen,
  onRecordingComplete,
  searchForm,
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
    handleRecordClick,
    handleRecordingFinish,
  } = useDashboardActions({
    setEditingNote,
    setIsNoteModalOpen,
    onRecordingComplete,
  });

  const handleSetEditingNote = (note: Partial<VoiceNote>) => {
    setEditingNote(note as VoiceNote);
  };

  return (
    <div className="mb-4">
      <RecordActionButton
        isLoading={isLoading}
        isRecording={isRecording}
        selectedFolderId={selectedFolderId}
        handleRecordClick={handleRecordClick}
      />

      <div className="my-4">
        <CreateNoteButton
          isLoading={isLoading}
          setEditingNote={handleSetEditingNote}
          setIsNoteModalOpen={setIsNoteModalOpen}
        />
      </div>

      <ExpandButton onClick={() => setIsExpanded(!isExpanded)} isLoading={isLoading} />

      {isExpanded && (
        <>
          <ActionButtons
            isLoading={isLoading}
            handleProjectClick={handleProjectClick}
            selectedFolderId={selectedFolderId}
          />
          {searchForm}
        </>
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
