import { Settings } from "lucide-react";
import React, { useState } from "react";
import { ProjectManagementModal } from "./_modals/ProjectManagementModal";

type ProjectManagementButtonProps = {
  isLoading: boolean;
};

export const ProjectManagementButton: React.FC<ProjectManagementButtonProps> = ({ isLoading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 px-4 py-2 border rounded-full w-full font-bold transition-colors duration-200"
        disabled={isLoading}
      >
        <Settings className="w-4 h-4" />
        Gérer les projets
      </button>

      <ProjectManagementModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
