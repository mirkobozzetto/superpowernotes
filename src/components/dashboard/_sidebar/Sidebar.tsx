import { cn } from "@chadcn/lib/utils";
import { type Folder } from "@prisma/client";
import { useFolderCache } from "@src/stores/folderCacheStore";
import { useNoteManagerStore } from "@src/stores/noteManagerStore";
import { ChevronDown, FolderIcon, Globe } from "lucide-react";
import { useEffect } from "react";
import { DroppableButton } from "./DroppableButton";

type FolderItemProps = {
  folder: Folder;
  depth?: number;
  onSelect: (folderId: string) => void;
  selectedFolderId?: string | null;
};

const FolderItem = ({ folder, depth = 0, onSelect, selectedFolderId }: FolderItemProps) => {
  const { subFolders } = useNoteManagerStore();
  const hasChildren = subFolders[folder.id]?.length > 0;
  const isSelected = selectedFolderId === folder.id;

  return (
    <div className="flex flex-col">
      <DroppableButton
        folderId={folder.id}
        onClick={() => onSelect(folder.id)}
        className={cn(
          "flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-gray-100",
          isSelected && "bg-gray-100 font-medium",
          depth > 0 && "pl-8"
        )}
      >
        <div className="flex items-center gap-2">
          <FolderIcon className="h-4 w-4" />
          <span className="truncate">{folder.name}</span>
        </div>
        {hasChildren && <ChevronDown className="h-4 w-4" />}
      </DroppableButton>

      {hasChildren && (
        <div className="ml-4 border-l">
          {subFolders[folder.id].map((subfolder) => (
            <FolderItem
              key={subfolder.id}
              folder={subfolder}
              depth={depth + 1}
              onSelect={onSelect}
              selectedFolderId={selectedFolderId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export function Sidebar({ onProjectSelect }: { onProjectSelect?: () => void }) {
  const { rootFolders, selectedFolderId, selectFolder, error, fetchFolders } =
    useNoteManagerStore();
  const folderCache = useFolderCache((state) => state.cachedFolders);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  const handleSelect = (folderId: string | null) => {
    selectFolder(folderId);
    onProjectSelect?.();
  };

  if (!folderCache && error) {
    return (
      <div className="flex h-screen w-64 flex-col border-r bg-white p-4">
        <h2 className="mb-4 text-lg font-semibold">Projects</h2>
        <div className="text-sm text-gray-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">Projects</h2>
      </div>
      <div className="flex-1 space-y-1 overflow-y-auto p-2 bg-white">
        <DroppableButton
          folderId={null}
          onClick={() => handleSelect(null)}
          className={cn(
            "flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-gray-100 mb-4",
            !selectedFolderId && "bg-gray-100 font-medium"
          )}
        >
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="truncate">Toutes mes notes</span>
          </div>
        </DroppableButton>

        <div className="w-full h-px bg-gray-200 my-2" />

        {rootFolders.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">No projects available</div>
        ) : (
          rootFolders.map((folder) => (
            <FolderItem
              key={folder.id}
              folder={folder}
              onSelect={handleSelect}
              selectedFolderId={selectedFolderId}
            />
          ))
        )}
      </div>
    </div>
  );
}
