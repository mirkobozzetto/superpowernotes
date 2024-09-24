export const AudioProcessingAnimation: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
      <div className="animate-bounce mb-4">
        <svg
          className="w-16 h-16 text-gray-500"
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
      <p className="text-gray-600 text-center">
        Processing your audio...
        <br />
        {`Please don't close this page.`}
      </p>
    </div>
  );
};
