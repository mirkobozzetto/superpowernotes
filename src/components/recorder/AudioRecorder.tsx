import { useRecorder } from "../../hooks/useRecorder";
import { AudioProcessingAnimation } from "./AudioProcessingAnimation";
import { ControlButtons } from "./ControlButtons";
import { MicrophonePermissionCheck } from "./MicrophonePermissionCheck";
import { RecordButton } from "./RecordButton";
import { RecordingAnimation } from "./RecordingAnimation";

export const AudioRecorder = () => {
  const {
    isRecording,
    isPaused,
    error,
    remainingTime,
    micPermission,
    setMicPermission,
    startRecording,
    stopRecording,
    pauseResumeRecording,
    cancelRecording,
    finishRecording,
    session,
    recordingTime,
    maxRecordingDuration,
    isProcessing,
  } = useRecorder();

  return (
    <div className="flex flex-col items-center justify-start space-y-6 w-full min-h-[300px]">
      <MicrophonePermissionCheck onPermissionChange={setMicPermission} />
      {micPermission === false && (
        <p className="bg-red-500 text-white text-center p-4 rounded-lg">
          Please enable microphone access to record audio.
        </p>
      )}
      {micPermission && (
        <>
          {!isProcessing && (
            <RecordButton
              isRecording={isRecording}
              onClick={isRecording ? stopRecording : startRecording}
            />
          )}
          <div className="flex flex-col items-center space-y-4 w-full">
            <div className="h-2 flex items-center justify-center">
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
                  />
                </div>
              )}
            </div>
            {error && (
              <p className="text-red-500 text-center w-full bg-red-50 p-6 rounded-full">{error}</p>
            )}
          </div>
        </>
      )}
      {remainingTime !== null && session?.user?.role !== "ADMIN" && (
        <div className="fixed bottom-2 left-0 right-0 flex justify-center pb-4">
          <p className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-full border border-gray-300/20 inline-block">
            Remaining time credits : {Math.floor(remainingTime / 60)}m {remainingTime % 60}s
          </p>
        </div>
      )}
    </div>
  );
};
