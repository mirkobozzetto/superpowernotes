type TranscriptionResponse = {
  transcription: string;
  duration: number;
  tags: string[];
  remainingTime?: number;
};

type VoiceNoteData = {
  transcription: string;
  duration: number;
  tags: string[];
  fileName?: string;
};

export const voiceNotesService = {
  async transcribeAudio(audioBlob: Blob, duration: number): Promise<TranscriptionResponse> {
    const formData = new FormData();
    formData.append("audio", audioBlob, `recording.${audioBlob.type.split("/")[1]}`);
    formData.append("duration", duration.toString());

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

    return data;
  },

  async saveVoiceNote(data: VoiceNoteData) {
    const response = await fetch("/api/voice-notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        fileName: data.fileName || "",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Save error: ${response.status} ${response.statusText}. Details: ${errorText}`
      );
    }

    return response.json();
  },
};
