import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const MAX_RECORDING_DURATION = 180; // 3 minutes in seconds

export const useRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [micPermission, setMicPermission] = useState<boolean | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);

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

  const startRecording = async () => {
    if (remainingTime !== null && remainingTime <= 0 && session?.user?.role !== "ADMIN") {
      setError("You have reached your monthly limit. Please upgrade your plan.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
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

    const audioBlob = new Blob(chunksRef.current, { type: "audio/mpeg" });
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.mp3");
    const duration = recordingTime;
    formData.append("duration", duration.toString());

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
        setRemainingTime((prevTime) => (prevTime !== null ? Math.max(0, prevTime - duration) : 0));
      }

      setIsSuccess(true);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error in sendAudioToServer:", error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
      setIsSuccess(false);
    } finally {
      setIsProcessing(false);
      // Reset recording state
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
  };
};
