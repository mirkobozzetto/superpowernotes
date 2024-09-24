import { useRecorder } from "../../hooks/useRecorder";
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
  } = useRecorder();

  return (
    <div className="flex flex-col items-center justify-center space-y-6 w-full">
      <MicrophonePermissionCheck onPermissionChange={setMicPermission} />
      {micPermission === false && (
        <p className="bg-red-500 text-white text-center p-4 rounded-lg">
          Please enable microphone access to record audio.
        </p>
      )}
      {micPermission && (
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8">{isRecording && <RecordingAnimation />}</div>
          <RecordButton
            isRecording={isRecording}
            onClick={isRecording ? stopRecording : startRecording}
          />
          <div className="flex flex-col items-center">
            {isRecording && (
              <>
                <div className="bg-white p-6">
                  <ControlButtons
                    isPaused={isPaused}
                    onPauseResume={pauseResumeRecording}
                    onCancel={cancelRecording}
                    onDone={finishRecording}
                    recordingTime={recordingTime}
                    maxRecordingDuration={maxRecordingDuration}
                  />
                </div>
              </>
            )}
          </div>
          {error && (
            <p className="text-red-500 text-center w-full bg-red-50 p-6 rounded-full">{error}</p>
          )}
          {remainingTime !== null && session?.user?.role !== "ADMIN" && (
            <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-full border border-gray-300/20">
              Remaining time credits : {Math.floor(remainingTime / 60)}m {remainingTime % 60}s
            </p>
          )}
        </div>
      )}
    </div>
  );
};
