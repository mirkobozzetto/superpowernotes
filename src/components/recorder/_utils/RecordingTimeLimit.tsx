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
    <div className="inline-flex justify-center items-center px-4 py-2 rounded-full w-16 text-base text-gray-600">
      <svg
        className="flex-shrink-0 mr-2 w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span className="flex-shrink-0 w-full">
        {minutes}:{seconds.toString().padStart(2, "0")}
      </span>
    </div>
  );
};
