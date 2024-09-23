import { useRecorder } from "../../hooks/useRecorder";
import { CancelButton } from "./CancelButton";
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
    cancelRecording,
    session,
  } = useRecorder();

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <MicrophonePermissionCheck onPermissionChange={setMicPermission} />
      {micPermission === false && (
        <p className=" bg-red-500 text-white text-center p-4 rounded-lg"></p>
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
              <div className="flex space-x-4">
                <PauseResumeButton isPaused={isPaused} onClick={pauseResumeRecording} />
                <CancelButton onClick={cancelRecording} />
              </div>
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
