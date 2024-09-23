import { useRecorder } from "../../hooks/useRecorder";
import { MicrophonePermissionCheck } from "./MicrophonePermissionCheck";
import { PauseResumeButton } from "./PauseResumeButton";
import { RecordButton } from "./RecordButton";
import { RecordingAnimation } from "./RecordingAnimation";
import { RecordingTimer } from "./RecordingTimer";

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
    session,
  } = useRecorder();

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <MicrophonePermissionCheck onPermissionChange={setMicPermission} />
      {micPermission === false && (
        <p className="text-red-500">Please enable microphone access to record audio.</p>
      )}
      {micPermission && (
        <>
          <RecordButton
            isRecording={isRecording}
            onClick={isRecording ? stopRecording : startRecording}
          />
          {isRecording && (
            <>
              <RecordingAnimation />
              <PauseResumeButton isPaused={isPaused} onClick={pauseResumeRecording} />
              <RecordingTimer isPaused={isPaused} />
            </>
          )}
          {error && <p className="text-red-500 text-center">{error}</p>}
          {remainingTime !== null && session?.user?.role !== "ADMIN" && (
            <p className="text-sm text-gray-600">
              Remaining time: {Math.floor(remainingTime / 60)}m {remainingTime % 60}s
            </p>
          )}
        </>
      )}
    </div>
  );
};
