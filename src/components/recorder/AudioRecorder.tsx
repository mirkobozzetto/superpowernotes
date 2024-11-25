import { MAX_RECORDING_DURATION } from "@src/constants/recorderConstants";
import React, { useEffect, useRef, useState } from "react";
import { useAudioHandling } from "../../hooks/_useRecorder/useAudioHandling";
import { useRecordingActions } from "../../hooks/_useRecorder/useRecordingActions";
import { useRecordingState } from "../../hooks/_useRecorder/useRecordingState";
import { useServerCommunication } from "../../hooks/_useRecorder/useServerCommunication";
import { useTimeManagement } from "../../hooks/_useRecorder/useTimeManagement";
import { useAudioHandlingStore } from "../../stores/audioHandlingStore";
import { RemainingTimeDisplay } from "../utils/RemainingTimeDisplay";
import { AudioProcessingAnimation } from "./_ui/AudioProcessingAnimation";
import { RecordButton } from "./_ui/RecordButton";
import { RecordingAnimation } from "./_ui/RecordingAnimation";
import { ControlButtons } from "./_utils/ControlButtons";
import { MicrophonePermissionCheck } from "./_utils/MicrophonePermissionCheck";

export type AudioRecorderProps = {
  onRecordingComplete: () => void;
  onRecordingStateChange?: (isRecording: boolean) => void;
};

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onRecordingComplete,
  onRecordingStateChange,
}) => {
  const [isCancelling, setIsCancelling] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    useAudioHandlingStore.getState().updateBrowserInfo();
  }, []);

  const {
    micPermission,
    setMicPermission,
    startRecording: startAudioRecording,
    stopRecording: stopAudioRecording,
    pauseRecording: pauseAudioRecording,
    resumeRecording: resumeAudioRecording,
    getAudioMimeType,
    chunksRef,
    cleanupAudioResources,
    initializeForExtension,
  } = useAudioHandling();

  const { isIOS } = useAudioHandlingStore();

  const { remainingTime, recordingTime, setRecordingTime, updateRemainingTime } =
    useTimeManagement();

  const {
    isRecording,
    setIsRecording,
    isPaused,
    setIsPaused,
    isProcessing,
    setIsProcessing,
    error,
    setError,
    isSuccess,
    setIsSuccess,
    startTimeRef,
    timerRef,
  } = useRecordingState();

  const { sendAudioToServer } = useServerCommunication(
    setError,
    setIsSuccess,
    updateRemainingTime,
    setIsFinishing
  );

  const actualRecordingTimeRef = useRef(0);

  const { finishRecording, startRecording, stopRecording, pauseResumeRecording, cancelRecording } =
    useRecordingActions(
      isCancelling,
      remainingTime,
      startAudioRecording,
      stopAudioRecording,
      pauseAudioRecording,
      resumeAudioRecording,
      getAudioMimeType,
      cleanupAudioResources,
      sendAudioToServer,
      setError,
      setIsRecording,
      setIsPaused,
      setIsSuccess,
      setRecordingTime,
      setIsProcessing,
      setIsFinishing,
      setIsCancelling,
      chunksRef,
      startTimeRef,
      timerRef,
      actualRecordingTimeRef
    );

  useEffect(() => {
    setIsProcessing(isFinishing);
  }, [isFinishing, setIsProcessing]);

  useEffect(() => {
    onRecordingStateChange?.(isRecording);
  }, [isRecording, onRecordingStateChange]);

  const handleFinishRecording = async () => {
    await finishRecording();
    onRecordingComplete();
  };

  return (
    <div className="flex flex-col justify-start items-center space-y-6 w-full min-h-[300px]">
      <MicrophonePermissionCheck onPermissionChange={setMicPermission} />
      {micPermission === false && (
        <p className="bg-red-500 p-4 rounded-lg text-center text-white">
          Please enable microphone access to record audio.
        </p>
      )}
      {micPermission && (
        <div className="flex flex-col items-center w-full">
          <RecordButton
            isRecording={isRecording}
            onClick={isRecording ? handleFinishRecording : startRecording}
            disabled={isProcessing}
            isIOS={isIOS}
          />
          {isFinishing && <AudioProcessingAnimation />}
          <div className="flex flex-col items-center w-full">
            <div className="flex justify-center items-center h-12">
              {isRecording && !isProcessing && <RecordingAnimation />}
            </div>
            {isRecording && !isProcessing && (
              <div className="bg-white">
                <ControlButtons
                  isPaused={isPaused}
                  onPauseResume={pauseResumeRecording}
                  onCancel={cancelRecording}
                  onDone={finishRecording}
                  recordingTime={recordingTime}
                  maxRecordingDuration={MAX_RECORDING_DURATION}
                  isCancelling={isCancelling}
                  isProcessing={isProcessing}
                  isIOS={isIOS}
                />
              </div>
            )}
          </div>
          {error && (
            <p className="bg-red-50 p-6 rounded-full w-full text-center text-red-500">{error}</p>
          )}
          <RemainingTimeDisplay remainingTime={remainingTime} />
        </div>
      )}
    </div>
  );
};
