"use client";

import { useDemoRecorder } from "@src/hooks/recorder/useDemoRecorder";
import React, { useEffect } from "react";
import { AudioProcessingAnimation } from "../../recorder/_ui/AudioProcessingAnimation";
import { RecordButton } from "../../recorder/_ui/RecordButton";
import { RecordingAnimation } from "../../recorder/_ui/RecordingAnimation";
import { ControlButtons } from "../../recorder/_utils/ControlButtons";
import { MicrophonePermissionCheck } from "../../recorder/_utils/MicrophonePermissionCheck";
import { DemoLimitModal } from "./DemoLimitModal";

export const DemoRecorder: React.FC = () => {
  const {
    isRecording,
    isPaused,
    isProcessing,
    error,
    demoResult,
    micPermission,
    setMicPermission,
    recordingTime,
    maxRecordingDuration,
    startRecording,
    stopRecording,
    pauseResumeRecording,
    finishRecording,
    cancelRecording,
    trialLimitReached,
    showLimitModal,
    setShowLimitModal,
    isCooldownActive,
    cooldownTimeLeft,
  } = useDemoRecorder();

  useEffect(() => {
    if (trialLimitReached) {
      setShowLimitModal(true);
    }
  }, [trialLimitReached, setShowLimitModal]);

  const handleCloseModal = () => {
    setShowLimitModal(false);
  };

  return (
    <div className="flex flex-col justify-start items-center space-y-6 w-full min-h-[300px]">
      <MicrophonePermissionCheck onPermissionChange={setMicPermission} />
      {micPermission === false && (
        <p className="bg-red-500 p-4 rounded-lg text-center text-white">
          Please enable microphone access to try the demo.
        </p>
      )}
      {micPermission && (
        <div className="flex flex-col items-center w-full">
          <RecordButton
            isRecording={isRecording}
            onClick={isRecording ? stopRecording : startRecording}
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
                  onPauseResume={pauseResumeRecording}
                  onCancel={cancelRecording}
                  onDone={finishRecording}
                  recordingTime={recordingTime}
                  maxRecordingDuration={maxRecordingDuration}
                  isCancelling={false}
                  isProcessing={false}
                />
              </div>
            )}
          </div>
          {error && (
            <p className="bg-red-50 p-6 rounded-full w-3/5 text-center text-red-500">{error}</p>
          )}
          {demoResult && demoResult.tags && demoResult.tags.length > 0 && (
            <div className="bg-blue-50 mt-4 p-4 rounded-lg w-full max-w-md">
              <h3 className="mb-2 font-bold text-lg">Transcription Result</h3>
              <p className="mb-3">{demoResult.transcription}</p>
              <div className="flex flex-wrap">
                {demoResult.tags.map((tag) => (
                  <span key={tag} className="bg-blue-200 mr-2 mb-2 px-2 py-1 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      <DemoLimitModal
        isOpen={showLimitModal}
        onClose={handleCloseModal}
        cooldownTimeLeft={cooldownTimeLeft}
      />
    </div>
  );
};
