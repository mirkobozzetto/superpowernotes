import { VoiceNote } from "@prisma/client";
import React from "react";

interface LastRecordedMessageProps {
  voiceNote: VoiceNote | null;
}

export const LastRecordedMessage: React.FC<LastRecordedMessageProps> = ({ voiceNote }) => {
  if (!voiceNote) return null;

  return (
    <div className="bg-blue-50 mt-4 p-4 rounded-lg w-full max-w-md">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg">{voiceNote.fileName}</h3>
      </div>
      <p className="mb-3">{voiceNote.transcription}</p>
      <div className="flex flex-wrap">
        {voiceNote.tags.map((tag) => (
          <span key={tag} className="bg-blue-200 mr-2 mb-2 px-2 py-1 rounded-full text-xs">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};
