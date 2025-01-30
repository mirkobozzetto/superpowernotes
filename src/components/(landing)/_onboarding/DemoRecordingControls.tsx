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
  onRecordClick: () => void;
  onPauseResume: () => void;
  onCancel: () => void;
  onFinish: () => void;
  maxRecordingDuration: number;
  isIOS: boolean;
  isCooldownActive: boolean;
  cooldownTimeLeft: number;
  trialLimitReached: boolean;
};

export const DemoRecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  isPaused,
  isProcessing,
  recordingTime,
  onRecordClick,
  onPauseResume,
  onCancel,
  onFinish,
  maxRecordingDuration,
  isIOS,
}) => {
  return (
    <div className="mb-4">
      <RecordButton
        isRecording={isRecording}
        onClick={onRecordClick}
        disabled={false}
        isIOS={isIOS}
      />
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
              isIOS={isIOS}
            />
          </div>
        )}
      </div>
    </div>
  );
};
