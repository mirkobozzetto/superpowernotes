import { Dispatch, SetStateAction } from "react";

type SetErrorType = Dispatch<SetStateAction<string | null>>;
type SetIsSuccessType = Dispatch<SetStateAction<boolean>>;
type SetRemainingTimeType = Dispatch<SetStateAction<number | null>>;

export const useServerCommunication = (
  setError: SetErrorType,
  setIsSuccess: SetIsSuccessType,
  setRemainingTime: SetRemainingTimeType,
  setIsFinishing: Dispatch<SetStateAction<boolean>>
) => {
  // const router = useRouter();

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

      const saveResponse = await saveVoiceNote(data.transcription, data.duration);
      if (saveResponse.remainingTime !== undefined) {
        setRemainingTime(saveResponse.remainingTime);
      }

      setIsSuccess(true);
    } catch (error) {
      console.error("Error in sendAudioToServer:", error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
      setIsSuccess(false);
    } finally {
      setIsFinishing(false);
    }
    console.log("Exiting sendAudioToServer");
  };

  const saveVoiceNote = async (transcription: string, duration: number) => {
    const response = await fetch("/api/voice-notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcription, fileName: "", tags: [], duration }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Save error: ${response.status} ${response.statusText}. Details: ${errorText}`
      );
    }
    return response.json();
  };

  return { sendAudioToServer };
};
