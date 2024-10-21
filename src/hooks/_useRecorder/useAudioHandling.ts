import { useAudioHandlingStore } from "@src/stores/audioHandlingStore";

export const useAudioHandling = () => {
  const {
    micPermission,
    setMicPermission,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    getAudioMimeType,
    chunks,
    isIOS,
    cleanupAudioResources,
  } = useAudioHandlingStore();

  return {
    micPermission,
    setMicPermission,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    getAudioMimeType,
    chunksRef: { current: chunks },
    isIOSRef: { current: isIOS },
    cleanupAudioResources,
  };
};
