import React from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import { RecordingTimeLimit } from "./RecordingTimeLimit";

interface ControlButtonsProps {
  isPaused: boolean;
  onPauseResume: () => void;
  onCancel: () => void;
  onDone: () => void;
  recordingTime: number;
  maxRecordingDuration: number;
  isCancelling: boolean;
  isProcessing: boolean;
}

export const ControlButtons: React.FC<ControlButtonsProps> = ({
  isPaused,
  onPauseResume,
  onCancel,
  onDone,
  recordingTime,
  maxRecordingDuration,
  isCancelling,
  isProcessing,
}) => {
  return (
    <div className="flex justify-between items-center space-x-2 sm:space-x-4 w-full">
      <div className="flex items-center space-x-1 sm:space-x-2">
        <RecordingTimeLimit
          recordingTime={recordingTime}
          maxRecordingDuration={maxRecordingDuration}
        />
        <button
          onClick={onPauseResume}
          disabled={isCancelling || isProcessing}
          className="size-8 sm:size-10 flex justify-center items-center border-gray-300 hover:bg-gray-50/50 disabled:opacity-50 border rounded-full disabled:cursor-not-allowed"
        >
          {isPaused ? (
            <FaPlay className="text-gray-900 text-xs sm:text-sm" />
          ) : (
            <FaPause className="text-gray-900 text-xs sm:text-sm" />
          )}
        </button>
      </div>
      <div className="flex space-x-1 sm:space-x-2">
        <button
          onClick={onCancel}
          disabled={isCancelling}
          className={`w-16 sm:w-24 px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm
            ${
              isCancelling
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-100 hover:bg-red-200 text-red-600"
            }
            font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-50`}
        >
          {isCancelling ? "Cancelling..." : "Cancel"}
        </button>
        <button
          onClick={onDone}
          disabled={isCancelling}
          className="bg-green-100 hover:bg-green-200 focus:ring-opacity-50 disabled:opacity-50 px-2 sm:px-4 py-1 sm:py-2 rounded-full focus:ring-2 focus:ring-green-300 w-16 sm:w-24 font-semibold text-green-600 text-xs sm:text-sm transition-all duration-300 disabled:cursor-not-allowed ease-in-out focus:outline-none"
        >
          Done
        </button>
      </div>
    </div>
  );
};
