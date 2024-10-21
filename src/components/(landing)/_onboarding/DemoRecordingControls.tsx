import React from "react";
import { AudioProcessingAnimation } from "../../recorder/_ui/AudioProcessingAnimation";
import { RecordButton } from "../../recorder/_ui/RecordButton";
import { RecordingAnimation } from "../../recorder/_ui/RecordingAnimation";
import { ControlButtons } from "../../recorder/_utils/ControlButtons";

type RecordingControlsProps = {
  isRecording: boolean;
  isPaused: boolean;
  isProcessing: boolean;
  recordingTime: number;
  isCooldownActive: boolean;
  cooldownTimeLeft: number;
  trialLimitReached: boolean;
  onRecordClick: () => void;
  onPauseResume: () => void;
  onCancel: () => void;
  onFinish: () => void;
  maxRecordingDuration: number;
};

export const DemoRecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  isPaused,
  isProcessing,
  recordingTime,
  isCooldownActive,
  cooldownTimeLeft,
  trialLimitReached,
  onRecordClick,
  onPauseResume,
  onCancel,
  onFinish,
  maxRecordingDuration,
}) => {
  return (
    <div className="flex flex-col items-center w-full">
      <RecordButton
        isRecording={isRecording}
        onClick={onRecordClick}
        disabled={isCooldownActive || trialLimitReached}
      />
      {isCooldownActive && (
        <p className="mt-2 text-blue-600">
          Vous pourrez enregistrer à nouveau dans {cooldownTimeLeft} secondes.
        </p>
      )}
      <div className="flex flex-col items-center w-full">
        <div className="flex justify-center items-center h-12">
          {isRecording && !isProcessing && <RecordingAnimation />}
          {isProcessing && <AudioProcessingAnimation />}
        </div>
        {isRecording && !isProcessing && (
          <div className="bg-white">
            <ControlButtons
              isPaused={isPaused}
              onPauseResume={onPauseResume}
              onCancel={onCancel}
              onDone={onFinish}
              recordingTime={recordingTime}
              maxRecordingDuration={maxRecordingDuration}
              isCancelling={false}
              isProcessing={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};
