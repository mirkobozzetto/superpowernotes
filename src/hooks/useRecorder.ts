import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const MAX_RECORDING_DURATION = 180;

export const useRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [micPermission, setMicPermission] = useState<boolean | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isIOSRef = useRef(false);

  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    isIOSRef.current = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  }, []);

  useEffect(() => {
    const fetchRemainingTime = async () => {
      try {
        const response = await fetch("/api/users/usage");
        const data = await response.json();
        setRemainingTime(data.remainingSeconds);
      } catch (error) {
        console.error("Error fetching remaining time:", error);
      }
    };

    fetchRemainingTime();
  }, []);

  const getAudioMimeType = () => {
    return isIOSRef.current ? "audio/wav" : "audio/webm";
  };

  const startRecording = async () => {
    if (remainingTime !== null && remainingTime <= 0 && session?.user?.role !== "ADMIN") {
      setError("You have reached your monthly limit. Please upgrade your plan.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getAudioMimeType();

      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = sendAudioToServer;
      mediaRecorderRef.current.start();

      startTimeRef.current = Date.now();
      setIsRecording(true);
      setIsPaused(false);
      setError(null);
      setIsSuccess(false);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => {
          if (prevTime >= MAX_RECORDING_DURATION - 1) {
            finishRecording();
            return MAX_RECORDING_DURATION;
          }
          return prevTime + 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
      setError("Failed to start recording. Please check your microphone permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = null;
      if (mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
    chunksRef.current = [];
    setIsRecording(false);
    setIsPaused(false);
    setError(null);
    setIsSuccess(false);
    setRecordingTime(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const pauseResumeRecording = () => {
    if (mediaRecorderRef.current) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
        timerRef.current = setInterval(() => {
          setRecordingTime((prevTime) => prevTime + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
    }
  };

  const finishRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const sendAudioToServer = async () => {
    setIsProcessing(true);
    setError(null);
    setIsSuccess(false);

    const mimeType = getAudioMimeType();
    const audioBlob = new Blob(chunksRef.current, { type: mimeType });
    const formData = new FormData();
    formData.append("audio", audioBlob, `recording.${mimeType.split("/")[1]}`);
    formData.append("duration", recordingTime.toString());
    formData.append("isIOS", isIOSRef.current.toString());

    try {
      console.log("Sending audio to server for transcription...");
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`Transcription error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Transcription received:", data.transcription);
      if (!data.transcription) {
        throw new Error("No transcription received from server");
      }

      console.log("Saving voice note...");
      const saveResponse = await fetch("/api/voiceNotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transcription: data.transcription,
          fileName: "AudioNote",
          tags: [],
          duration: data.duration,
        }),
      });
      if (!saveResponse.ok) {
        throw new Error(`Save error: ${saveResponse.status} ${saveResponse.statusText}`);
      }
      const savedData = await saveResponse.json();
      console.log("Note saved successfully:", savedData);

      if (remainingTime !== null && session?.user?.role !== "ADMIN") {
        setRemainingTime((prevTime) =>
          prevTime !== null ? Math.max(0, prevTime - recordingTime) : 0
        );
      }

      setIsSuccess(true);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error in sendAudioToServer:", error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
      setIsSuccess(false);
    } finally {
      setIsProcessing(false);
      setIsRecording(false);
      setIsPaused(false);
      setRecordingTime(0);
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      }
      chunksRef.current = [];
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    isRecording,
    isPaused,
    error,
    remainingTime,
    micPermission,
    setMicPermission,
    startRecording,
    stopRecording,
    pauseResumeRecording,
    finishRecording,
    cancelRecording,
    isSuccess,
    session,
    recordingTime,
    maxRecordingDuration: MAX_RECORDING_DURATION,
    isProcessing,
    isIOS: isIOSRef.current,
  };
};
