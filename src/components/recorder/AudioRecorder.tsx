import { useRecorder } from "../../hooks/useRecorder";
import { RemainingTimeDisplay } from "../utils/RemainingTimeDisplay";
import { AudioProcessingAnimation } from "./_ui/AudioProcessingAnimation";
import { RecordButton } from "./_ui/RecordButton";
import { RecordingAnimation } from "./_ui/RecordingAnimation";
import { ControlButtons } from "./_utils/ControlButtons";
import { MicrophonePermissionCheck } from "./_utils/MicrophonePermissionCheck";

export const AudioRecorder = ({ onRecordingComplete }: { onRecordingComplete: () => void }) => {
  const {
    isRecording,
    isPaused,
    error,
    micPermission,
    setMicPermission,
    startRecording,
    pauseResumeRecording,
    cancelRecording,
    recordingTime,
    maxRecordingDuration,
    isProcessing,
    remainingTime,
    isCancelling,
    isFinishing,
    finishRecording,
  } = useRecorder();

  const handleFinishRecording = async () => {
    console.log("handleFinishRecording called");
    await finishRecording();
    console.log("finishRecording completed, waiting before calling onRecordingComplete");
    setTimeout(() => {
      console.log("Calling onRecordingComplete");
      onRecordingComplete();
    }, 6500);
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
                  maxRecordingDuration={maxRecordingDuration}
                  isCancelling={isCancelling}
                  isProcessing={isProcessing}
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
