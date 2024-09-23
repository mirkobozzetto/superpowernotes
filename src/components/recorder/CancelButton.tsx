interface Props {
  onClick: () => void;
}

export const CancelButton = ({ onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className="
        px-4 py-2 rounded-md
        bg-red-100 hover:bg-red-200
        text-red-600 font-semibold
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-50
      "
    >
      Cancel
    </button>
  );
};
