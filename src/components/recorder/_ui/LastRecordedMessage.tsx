import { VoiceNote } from "@prisma/client";
import React from "react";

interface LastRecordedMessageProps {
  voiceNote: VoiceNote | null;
}

export const LastRecordedMessage: React.FC<LastRecordedMessageProps> = ({ voiceNote }) => {
  if (!voiceNote) return null;

  return (
    <div className="bg-blue-50 mt-4 mb-2 p-4 rounded-lg w-full max-w-md">
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
