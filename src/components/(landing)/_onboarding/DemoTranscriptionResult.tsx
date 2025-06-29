import React from "react";

type DemoResult = {
  transcription: string;
  tags: string[];
  fileName: string;
};

type DemoTranscriptionResultProps = {
  result: DemoResult;
};

export const DemoTranscriptionResult: React.FC<DemoTranscriptionResultProps> = ({ result }) => {
  if (!result || !result.tags || result.tags.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 shadow-md mt-4 mb-4 p-8 border border-blue-200 rounded-lg w-full max-w-md">
      <h3 className="mb-2 font-bold text-lg">{result.fileName}</h3>
      <p className="mb-3">{result.transcription}</p>
      <div className="flex flex-wrap justify-center">
        {result.tags.map((tag) => (
          <span key={tag} className="bg-blue-200 mr-2 mb-2 px-2 py-1 rounded-full text-xs">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};
