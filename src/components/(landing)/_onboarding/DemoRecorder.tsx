import { MAX_DEMO_DURATION } from "@src/constants/demoConstants";
import { useDemoAudioHandling } from "@src/hooks/_useDemoRecorder/useDemoAudioHandling";
import { useDemoRecordingActions } from "@src/hooks/_useDemoRecorder/useDemoRecordingActions";
import { useAudioHandlingStore } from "@src/stores/audioHandlingStore";
import { useTrialManagementStore } from "@src/stores/trialManagementStore";
import React, { useCallback, useEffect } from "react";
import { MicrophonePermissionCheck } from "../../recorder/_utils/MicrophonePermissionCheck";
import { DemoRecordingControls } from "./DemoRecordingControls";
import { DemoTranscriptionResult } from "./DemoTranscriptionResult";

export const DemoRecorder: React.FC = () => {
  useEffect(() => {
    useAudioHandlingStore.getState().updateBrowserInfo();
  }, []);

  const {
    micPermission,
    setMicPermission,
    startRecording: startAudioRecording,
    stopRecording: stopAudioRecording,
    pauseRecording,
    resumeRecording,
    getAudioMimeType,
    cleanupAudioResources,
  } = useDemoAudioHandling();

  const { setShowLimitModal } = useTrialManagementStore();

  const {
    isRecording,
    isPaused,
    isProcessing,
    error,
    demoResult,
    recordingTime,
    startRecording,
    pauseResumeRecording,
    cancelRecording,
    finishRecording,
  } = useDemoRecordingActions(
    startAudioRecording,
    stopAudioRecording,
    pauseRecording,
    resumeRecording,
    cleanupAudioResources,
    getAudioMimeType
  );

  const handleCloseModal = useCallback(() => {
    setShowLimitModal(false);
  }, [setShowLimitModal]);

  const handleFinishRecording = useCallback(async () => {
    await finishRecording();
  }, [finishRecording]);

  const handleRecordButtonClick = useCallback(() => {
    if (isRecording) {
      handleFinishRecording();
    } else {
      startRecording();
    }
  }, [isRecording, handleFinishRecording, startRecording]);

  const { isIOS } = useAudioHandlingStore();

  return (
    <div className="flex flex-col justify-start items-center space-y-6 w-full min-h-[300px]">
      <MicrophonePermissionCheck onPermissionChange={setMicPermission} />

      {micPermission === false && (
        <p className="bg-red-500 p-4 rounded-lg text-center text-white">
          Please enable microphone access to try the demo.
        </p>
      )}

      {micPermission && (
        <DemoRecordingControls
          isRecording={isRecording}
          isPaused={isPaused}
          isProcessing={isProcessing}
          recordingTime={recordingTime}
          onRecordClick={handleRecordButtonClick}
          onPauseResume={pauseResumeRecording}
          onCancel={cancelRecording}
          onFinish={handleFinishRecording}
          maxRecordingDuration={MAX_DEMO_DURATION}
          isIOS={isIOS}
          isCooldownActive={false}
          cooldownTimeLeft={0}
          trialLimitReached={false}
        />
      )}

      {error && (
        <p className="bg-red-50 p-6 rounded-full w-3/5 text-center text-red-500">{error}</p>
      )}

      {demoResult && <DemoTranscriptionResult result={demoResult} />}
    </div>
  );
};
