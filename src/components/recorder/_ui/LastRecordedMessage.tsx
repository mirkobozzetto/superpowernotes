import { VoiceNote } from "@prisma/client";
import React from "react";

export type LastRecordedMessageProps = {
  voiceNote: VoiceNote | null;
  isNewRecording?: boolean;
};

export const LastRecordedMessage: React.FC<LastRecordedMessageProps> = ({
  voiceNote,
  isNewRecording,
}) => {
  if (!voiceNote) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 shadow-md mt-4 mb-4 p-8 border border-blue-200 rounded-lg w-full max-w-md">
      <div className="flex justify-center items-start mb-2">
        <h3 className="font-bold text-xl">{voiceNote.fileName}</h3>
      </div>
      <p className="justify-center my-6 text-center text-md">{voiceNote.transcription}</p>
      <div className="flex flex-wrap justify-center">
        {voiceNote.tags.map((tag) => (
          <span key={tag} className="bg-blue-200 mr-2 mb-2 px-2 py-1 rounded-full text-xs">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};
