import { VoiceNote } from "@prisma/client";
import { CopyToClipboard } from "@src/components/actions/CopyToClipboard";

export type LastRecordedMessageProps = {
  voiceNote: VoiceNote | null;
  isNewRecording?: boolean;
  isProcessing?: boolean;
};

export const LastRecordedMessage: React.FC<LastRecordedMessageProps> = ({
  voiceNote,
  isProcessing = false,
}) => {
  if (!voiceNote) return null;

  return (
    <div
      className={`bg-gradient-to-r from-blue-50 to-blue-100 shadow-md mt-4 mb-4 p-8 border border-blue-200 rounded-lg w-full max-w-md relative ${isProcessing ? "opacity-50" : ""}`}
    >
      {isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900" />
        </div>
      )}
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-xl">{voiceNote.fileName}</h3>
        <CopyToClipboard text={voiceNote.transcription} />
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
