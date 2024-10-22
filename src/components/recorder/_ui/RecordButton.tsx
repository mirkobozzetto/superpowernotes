import { cn } from "@chadcn/lib/utils";
import { FaMicrophone } from "react-icons/fa";

type Props = {
  isRecording: boolean;
  disabled?: boolean;
  onClick: () => void;
  isIOS: boolean;
};

export const RecordButton = ({ isRecording, onClick, disabled }: Props) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "size-40 md:size-64 rounded-full mt-12",
        "relative overflow-hidden",
        "transition-all duration-500 ease-in-out",
        "focus:outline-none focus:ring-8 focus:ring-red-400 focus:ring-opacity-50",
        "bg-gradient-to-br from-red-400 via-red-500 to-red-800",
        "shadow-lg hover:shadow-lg shadow-red-500/20 hover:shadow-red-800/40",
        disabled && "cursor-not-allowed opacity-70 hover:opacity-90"
      )}
    >
      {isRecording && (
        <div
          className={cn(
            "absolute inset-0",
            "bg-gradient-to-br from-red-400/50 via-red-500/50 to-red-700/60",
            "animate-pulse-slow opacity-100"
          )}
        />
      )}
      <div className="absolute inset-0 flex justify-center items-center">
        <FaMicrophone
          className={cn(
            "text-white/95 text-7xl md:text-9xl",
            "transition-transform duration-300 ease-in-out",
            isRecording ? "scale-110" : ""
          )}
        />
      </div>
    </button>
  );
};
