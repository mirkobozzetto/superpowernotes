import { Dispatch, SetStateAction } from "react";

type SetErrorType = Dispatch<SetStateAction<string | null>>;
type SetIsSuccessType = Dispatch<SetStateAction<boolean>>;
type UpdateRemainingTimeType = (duration: number) => void;

export const useServerCommunication = (
  setError: SetErrorType,
  setIsSuccess: SetIsSuccessType,
  updateRemainingTime: UpdateRemainingTimeType,
  setIsFinishing: Dispatch<SetStateAction<boolean>>
) => {
  const sendAudioToServer = async (audioBlob: Blob, duration: number) => {
    setIsFinishing(true);
    const formData = new FormData();
    formData.append("audio", audioBlob, `recording.${audioBlob.type.split("/")[1]}`);
    formData.append("duration", duration.toString());

    try {
      const response = await fetch("/api/transcribe", { method: "POST", body: formData });
      if (!response.ok)
        throw new Error(`Transcription error: ${response.status} ${response.statusText}`);

      const data = await response.json();
      if (!data.transcription) throw new Error("No transcription received from server");

      if (data.remainingTime !== undefined) {
        updateRemainingTime(duration);
      }

      setIsSuccess(true);
    } catch (error) {
      console.error("Error in sendAudioToServer:", error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
      setIsSuccess(false);
    } finally {
      setIsFinishing(false);
    }
  };

  return { sendAudioToServer };
};
