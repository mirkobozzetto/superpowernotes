import { Button } from "@chadcn/components/ui/button";
import { cn } from "@chadcn/lib/utils";
import { type Folder } from "@prisma/client";
import { noteMoveService } from "@src/services/noteMoveService";
import { useNoteManagerStore } from "@src/stores/noteManagerStore";
import { ChevronDown, FolderIcon, Globe } from "lucide-react";
import { LegacyRef, useEffect } from "react";
import { useDrop } from "react-dnd";

type DroppableItemProps = {
  folderId: string | null;
  children: React.ReactNode;
  onMove: (noteId: string, folderId: string | null) => Promise<void>;
};

const DroppableItem = ({ folderId, children, onMove }: DroppableItemProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "NOTE",
    drop: async (item: { id: string }) => {
      await onMove(item.id, folderId);
      const event = new Event("noteMoved");
      window.dispatchEvent(event);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop as unknown as LegacyRef<HTMLDivElement>} className={cn(isOver && "bg-blue-50")}>
      {children}
    </div>
  );
};

type FolderItemProps = {
  folder: Folder;
  depth?: number;
  onSelect: (folderId: string) => void;
  selectedFolderId?: string | null;
  onMove: (noteId: string, folderId: string | null) => Promise<void>;
};

const FolderItem = ({ folder, depth = 0, onSelect, selectedFolderId, onMove }: FolderItemProps) => {
  const { subFolders } = useNoteManagerStore();
  const hasChildren = subFolders[folder.id]?.length > 0;
  const isSelected = selectedFolderId === folder.id;

  return (
    <div className="flex flex-col">
      <DroppableItem folderId={folder.id} onMove={onMove}>
        <Button
          variant="ghost"
          className={cn(
            "flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-gray-100",
            isSelected && "bg-gray-100 font-medium",
            depth > 0 && "pl-8"
          )}
          onClick={() => onSelect(folder.id)}
        >
          <div className="flex items-center gap-2">
            <FolderIcon className="h-4 w-4" />
            <span className="truncate">{folder.name}</span>
          </div>
          {hasChildren && <ChevronDown className="h-4 w-4" />}
        </Button>
      </DroppableItem>

      {hasChildren && (
        <div className="ml-4 border-l">
          {subFolders[folder.id].map((subfolder) => (
            <FolderItem
              key={subfolder.id}
              folder={subfolder}
              depth={depth + 1}
              onSelect={onSelect}
              selectedFolderId={selectedFolderId}
              onMove={onMove}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export function Sidebar({ onProjectSelect }: { onProjectSelect?: () => void }) {
  const { rootFolders, selectedFolderId, selectFolder, isLoading, error, fetchFolders } =
    useNoteManagerStore();

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  const handleSelect = (folderId: string | null) => {
    selectFolder(folderId);
    onProjectSelect?.();
  };

  const handleMove = async (noteId: string, folderId: string | null) => {
    await noteMoveService.moveNote(noteId, folderId);
    if (folderId) {
      await selectFolder(folderId);
    }
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains("bg-white")) {
      onProjectSelect?.();
    }
  };

  if (isLoading || error) {
    return (
      <div className="flex h-screen w-64 flex-col border-r bg-white p-4">
        <h2 className="mb-4 text-lg font-semibold">Projects</h2>
        <div className="text-sm text-gray-500">{isLoading ? "Loading projects..." : error}</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-white" onClick={handleBackgroundClick}>
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">Projects</h2>
      </div>
      <div className="flex-1 space-y-1 overflow-y-auto p-2 bg-white">
        <DroppableItem folderId={null} onMove={handleMove}>
          <Button
            variant="ghost"
            className={cn(
              "flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-gray-100 mb-4",
              !selectedFolderId && "bg-gray-100 font-medium"
            )}
            onClick={() => handleSelect(null)}
          >
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="truncate">Toutes mes notes</span>
            </div>
          </Button>
        </DroppableItem>

        <div className="w-full h-px bg-gray-200 my-2" />

        {rootFolders.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">No projects available</div>
        ) : (
          rootFolders.map((folder) => (
            <FolderItem
              key={folder.id}
              folder={folder}
              onSelect={(folderId) => {
                handleSelect(folderId);
              }}
              selectedFolderId={selectedFolderId}
              onMove={handleMove}
            />
          ))
        )}
      </div>
    </div>
  );
}
