import { useRef, useState } from "react";

export const useAudioHandling = () => {
  const [micPermission, setMicPermission] = useState<boolean | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const isIOSRef = useRef(false);

  const getAudioMimeType = () => {
    return isIOSRef.current ? "audio/wav" : "audio/webm";
  };

  const startRecording = async (
    onDataAvailable: (event: BlobEvent) => void,
    onStop: () => void
  ) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getAudioMimeType();

      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = onDataAvailable;
      mediaRecorderRef.current.onstop = onStop;
      mediaRecorderRef.current.start();

      setMicPermission(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      setMicPermission(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause();
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume();
    }
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
  };
};
