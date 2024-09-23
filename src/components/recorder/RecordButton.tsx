import { FaMicrophone } from "react-icons/fa";

interface Props {
  isRecording: boolean;
  onClick: () => void;
}

export const RecordButton = ({ isRecording, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-24 h-24 rounded-full
        flex items-center justify-center
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-4 focus:ring-red-400 focus:ring-opacity-50
        ${isRecording ? "bg-red-600 scale-105" : "bg-red-600 hover:scale-105"}
      `}
    >
      <FaMicrophone
        className={`
          transition-all duration-300 ease-in-out
          ${isRecording ? "text-white text-3xl" : "text-white text-4xl"}
        `}
      />
    </button>
  );
};
