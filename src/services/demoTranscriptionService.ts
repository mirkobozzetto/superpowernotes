export const demoTranscriptionService = async (
  audioBlob: Blob,
  duration: number
): Promise<{ transcription: string; tags: string[]; fileName: string }> => {
  const formData = new FormData();
  const audioFile = new File([audioBlob], "demo_recording.webm", { type: audioBlob.type });
  formData.append("audio", audioFile);
  formData.append("duration", duration.toString());

  const response = await fetch("/api/demo-transcribe", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error: any = new Error(`HTTP error! status: ${response.status}`);
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  return {
    transcription: data.transcription,
    tags: data.tags || [],
    fileName: data.fileName || "Note sans titre",
  };
};
