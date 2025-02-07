import React from "react";

type MagicButtonProps = {
  onClick: () => void;
  isLoading?: boolean;
};

export const MagicButton: React.FC<MagicButtonProps> = ({ onClick, isLoading = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="bg-yellow-200 hover:bg-yellow-300 text-yellow-600 hover:text-yellow-700 font-bold py-2 px-4 rounded-full flex items-center gap-2 transition-colors duration-200 border border-yellow-300 hover:border-yellow-500"
    >
      {isLoading ? (
        "…"
      ) : (
        <p>
          <span>⚡</span> IA &nbsp;
        </p>
      )}
    </button>
  );
};
