import { useRecorder } from "../../hooks/useRecorder";
import { RemainingTimeDisplay } from "../utils/RemainingTimeDisplay";
import { AudioProcessingAnimation } from "./_ui/AudioProcessingAnimation";
import { RecordButton } from "./_ui/RecordButton";
import { RecordingAnimation } from "./_ui/RecordingAnimation";
import { ControlButtons } from "./_utils/ControlButtons";
import { MicrophonePermissionCheck } from "./_utils/MicrophonePermissionCheck";

export const AudioRecorder = () => {
  const {
    isRecording,
    isPaused,
    error,
    micPermission,
    setMicPermission,
    startRecording,
    stopRecording,
    pauseResumeRecording,
    cancelRecording,
    finishRecording,
    recordingTime,
    maxRecordingDuration,
    isProcessing,
    remainingTime,
    isCancelling,
  } = useRecorder();

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
          {!isProcessing && (
            <RecordButton
              isRecording={isRecording}
              onClick={isRecording ? stopRecording : startRecording}
            />
          )}
          <div className="flex flex-col items-center w-full">
            <div className="flex justify-center items-center h-12">
              {isRecording && !isProcessing && <RecordingAnimation />}
              {isProcessing && <AudioProcessingAnimation />}
            </div>
            <div className="flex flex-col items-center w-full">
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
                  />
                </div>
              )}
            </div>
            {error && (
              <p className="bg-red-50 p-6 rounded-full w-full text-center text-red-500">{error}</p>
            )}
          </div>
          <RemainingTimeDisplay remainingTime={remainingTime} />
        </div>
      )}
    </div>
  );
};
