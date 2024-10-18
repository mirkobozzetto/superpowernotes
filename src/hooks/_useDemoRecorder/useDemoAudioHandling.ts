import { useDemoAudioHandlingStore } from "@src/stores/demoAudioHandlingStore";
import { useRef } from "react";

export const useDemoAudioHandling = () => {
  const {
    micPermission,
    setMicPermission,
    startRecording: storeStartRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    getAudioMimeType,
    cleanupAudioResources,
    chunks,
  } = useDemoAudioHandlingStore();

  const chunksRef = useRef<Blob[]>(chunks);
  const isIOSRef = useRef(false);

  if (chunks !== chunksRef.current) {
    chunksRef.current = chunks;
  }

  const startRecording = async (
    onDataAvailable: (event: BlobEvent) => void,
    onStop: () => void,
    shouldProcessAudio: () => boolean
  ) => {
    await storeStartRecording(onDataAvailable, onStop, shouldProcessAudio);
  };

  return {
    micPermission,
    setMicPermission,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    getAudioMimeType,
    chunksRef,
    isIOSRef,
    cleanupAudioResources,
  };
};
