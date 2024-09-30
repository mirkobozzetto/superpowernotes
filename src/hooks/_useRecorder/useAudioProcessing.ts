import { useCallback } from "react";

export const useAudioProcessing = (
  recordingTime: number,
  isIOS: boolean,
  fetchRemainingTime: () => Promise<void>
) => {
  const sendAudioToServer = useCallback(
    async (audioChunks: Blob[]) => {
      const mimeType = isIOS ? "audio/wav" : "audio/webm";
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      const formData = new FormData();
      formData.append("audio", audioBlob, `recording.${mimeType.split("/")[1]}`);
      formData.append("duration", recordingTime.toString());
      formData.append("isIOS", isIOS.toString());

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Transcription error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.transcription) {
        throw new Error("No transcription received from server");
      }

      const saveResponse = await fetch("/api/voiceNotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

      await fetchRemainingTime();

      if (saveResponse.ok) {
        await fetchRemainingTime();
      }

      return data;
    },
    [recordingTime, isIOS, fetchRemainingTime]
  );

  return { sendAudioToServer };
};
