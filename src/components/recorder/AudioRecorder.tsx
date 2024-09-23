"use client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const router = useRouter();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = sendAudioToServer;
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setError(null);
    } catch (error) {
      console.error("Error starting recording:", error);
      setError("Failed to start recording. Please check your microphone permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioToServer = async () => {
    const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");
    try {
      console.log("Sending audio to server for transcription...");
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Transcription received:", data.transcription);
      if (!data.transcription) {
        throw new Error("No transcription received from server");
      }
      const saveResponse = await fetch("/api/voiceNotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transcription: data.transcription,
          fileName: "AudioNote",
          tags: [],
        }),
      });
      if (!saveResponse.ok) {
        throw new Error(`HTTP error! status: ${saveResponse.status}`);
      }
      const savedData = await saveResponse.json();
      console.log("Note saved successfully:", savedData);
      setError(null);

      router.push("/dashboard");
    } catch (error) {
      console.error("Error in sendAudioToServer:", error);
      setError("Failed to process or save the audio. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`
          w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full
          bg-transparent border-8 border-gray-800
          flex items-center justify-center
          transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50
          group
        `}
      >
        <div
          className={`
            w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full
            bg-gradient-to-br from-red-100 to-red-900
            transition-all duration-300 ease-in-out
            group-hover:scale-105
            ${isRecording ? "scale-110" : ""}
          `}
        >
          <div
            className={`
              w-full h-full rounded-full
              bg-gradient-to-tr from-red-400 to-red-700 opacity-80
              ${isRecording ? "animate-pulse-gradient" : ""}
            `}
          ></div>
        </div>
      </button>
      <p className="text-lg sm:text-xl lg:text-2xl text-center font-semibold">
        {isRecording ? "Stop Recording" : "Start Recording"}
      </p>
      {error && <p className="text-red-500 text-center">{error}</p>}
    </div>
  );
}
