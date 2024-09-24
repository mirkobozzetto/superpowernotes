import React from "react";

export const AudioProcessingAnimation: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm"></div>
      <div className="relative bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
        <div className="flex flex-col items-center">
          <div className="animate-bounce mb-4">
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
          <p className="text-gray-800 text-center font-semibold mb-2">Processing your audio...</p>
          <p className="text-gray-600 text-center text-sm">{`Please don't close this page.`}</p>
        </div>
      </div>
    </div>
  );
};
