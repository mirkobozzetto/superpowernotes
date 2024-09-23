import { FaTimes } from "react-icons/fa";

interface Props {
  onClick: () => void;
}

export const CancelButton = ({ onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className="
        w-12 h-12 rounded-full
        flex items-center justify-center
        bg-gray-200 hover:bg-gray-300
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50
      "
    >
      <FaTimes className="text-red-600 text-xl" />
    </button>
  );
};
