import { FaPause, FaPlay } from "react-icons/fa";
import { RecordingTimeLimit } from "./RecordingTimeLimit";

interface ControlButtonsProps {
  isPaused: boolean;
  onPauseResume: () => void;
  onCancel: () => void;
  onDone: () => void;
  recordingTime: number;
  maxRecordingDuration: number;
}

export const ControlButtons = ({
  isPaused,
  onPauseResume,
  onCancel,
  onDone,
  recordingTime,
  maxRecordingDuration,
}: ControlButtonsProps) => {
  return (
    <div className="flex items-center space-x-4 w-full">
      <div className="flex items-center space-x-2">
        <RecordingTimeLimit
          recordingTime={recordingTime}
          maxRecordingDuration={maxRecordingDuration}
        />
        <button
          onClick={onPauseResume}
          className="
            size-10
            flex items-center justify-center
            border border-gray-300 rounded-3xl
            hover:bg-gray-50/50
          "
        >
          {isPaused ? <FaPlay className="text-gray-900" /> : <FaPause className="text-gray-900" />}
        </button>
      </div>
      <button
        onClick={onCancel}
        className="
          w-24 px-4 py-2 rounded-3xl
          bg-red-100 hover:bg-red-200
          text-red-600 font-semibold
          transition-all duration-300 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-50
        "
      >
        Cancel
      </button>
      <button
        onClick={onDone}
        className="
          w-24 px-4 py-2 rounded-3xl
          bg-green-100 hover:bg-green-200
          text-green-600 font-semibold
          transition-all duration-300 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-50
        "
      >
        Done
      </button>
    </div>
  );
};
