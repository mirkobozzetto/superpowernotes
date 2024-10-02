import React from "react";

interface RemainingTimeDisplayProps {
  remainingTime: number | null;
}

export const RemainingTimeDisplay: React.FC<RemainingTimeDisplayProps> = ({ remainingTime }) => {
  if (remainingTime === null) {
    return null;
  }

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  return (
    <div className="flex justify-center items-center my-4">
      <div className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full flex items-center">
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
          Remaining time: {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
        </span>
      </div>
    </div>
  );
};
