export const RecordingTimeLimit = ({
  recordingTime,
  maxRecordingDuration,
}: {
  recordingTime: number;
  maxRecordingDuration: number;
}) => {
  const remainingTime = maxRecordingDuration - recordingTime;
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  return (
    <div className=" inline-flex items-center px-4 py-2 rounded-full text-gray-600 text-base ">
      <svg
        className="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>
        {minutes}:{seconds.toString().padStart(2, "0")}
      </span>
    </div>
  );
};
