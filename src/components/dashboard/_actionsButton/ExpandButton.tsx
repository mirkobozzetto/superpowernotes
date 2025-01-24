import { Plus } from "lucide-react";

type ExpandButtonProps = {
  onClick: () => void;
  isLoading: boolean;
};

export const ExpandButton = ({ onClick, isLoading }: ExpandButtonProps) => (
  <button
    onClick={onClick}
    className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 px-4 py-2 border rounded-full w-full font-bold transition-colors duration-200 border-gray-300 mb-4"
    disabled={isLoading}
  >
    <span className="flex items-center w-4 h-4">
      <Plus />
    </span>
    Actions rapides
  </button>
);
