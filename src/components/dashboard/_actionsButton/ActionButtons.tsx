import { Settings } from "lucide-react";

type ActionButtonsProps = {
  isLoading: boolean;
  handleProjectClick: () => void;
  selectedFolderId: string | null;
};

export const ActionButtons = ({ isLoading, handleProjectClick }: ActionButtonsProps) => (
  <div className="space-y-4">
    <button
      onClick={handleProjectClick}
      className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 px-4 py-2 border rounded-full w-full font-bold transition-colors duration-200"
      disabled={isLoading}
    >
      <Settings className="w-4 h-4" />
      Gérer les projets
    </button>
  </div>
);
