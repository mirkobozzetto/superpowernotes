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
        transition-colors duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50
        ${isRecording ? "bg-red-600" : "bg-gray-200"}
      `}
    >
      <div className={`w-16 h-16 rounded-full ${isRecording ? "bg-white" : "bg-red-600"}`} />
    </button>
  );
};
