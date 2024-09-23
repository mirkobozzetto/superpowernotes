import { RecordingAnimation } from "./RecordingAnimation";
import { RecordingTimer } from "./RecordingTimer";

interface ControlButtonsProps {
  isPaused: boolean;
  onPauseResume: () => void;
  onCancel: () => void;
  onDone: () => void;
}

export const ControlButtons = ({
  isPaused,
  onPauseResume,
  onCancel,
  onDone,
}: ControlButtonsProps) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <RecordingAnimation />
      <div className="flex items-center space-x-4 w-full">
        <div className="flex items-center space-x-2">
          <RecordingTimer isPaused={isPaused} />
          <button
            onClick={onPauseResume}
            className="
              w-24 px-4 py-2
              border rounded-3xl
              transition-colors
              bg-white hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50
            "
          >
            {isPaused ? "Resume" : "Pause"}
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
    </div>
  );
};
