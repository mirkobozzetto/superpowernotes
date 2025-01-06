import React from "react";

export const AudioProcessingAnimation: React.FC = () => {
  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm"></div>
      <div className="relative bg-white shadow-xl mx-4 p-6 rounded-lg w-full max-w-sm">
        <div className="flex flex-col items-center">
          <div className="mb-4 animate-bounce">
            <svg
              className="w-16 h-16 text-blue-500"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
            </svg>
          </div>
          <p className="mb-2 font-semibold text-center text-gray-800">{`Traitement de l'audio...`}</p>
          <p className="text-center text-gray-600 text-sm">{`Cette opération peut prendre quelques secondes.`}</p>
        </div>
      </div>
    </div>
  );
};
