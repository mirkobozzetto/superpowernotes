import { voiceNotesService } from "@src/services/voiceNotesService";
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

    try {
      const transcriptionData = await voiceNotesService.transcribeAudio(audioBlob, duration);

      const saveResponse = await voiceNotesService.saveVoiceNote({
        transcription: transcriptionData.transcription,
        duration: transcriptionData.duration,
        tags: transcriptionData.tags || [],
      });

      if (saveResponse.remainingTime !== undefined) {
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
