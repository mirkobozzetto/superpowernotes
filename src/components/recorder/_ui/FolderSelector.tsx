import { Button } from "@chadcn/components/ui/button";
import { Dialog, DialogContent } from "@chadcn/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@chadcn/components/ui/select";
import { useFolderSelector } from "@src/hooks/_useFolder/useFolderSelector";
import { useState } from "react";
import { CreateFolderForm } from "./CreateFolderForm";

type FolderSelectorProps = {
  onFolderSelect: (folderId: string | null) => void;
};

export const FolderSelector = ({ onFolderSelect }: FolderSelectorProps) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const {
    selectedFolder,
    isLoading,
    selectFolder,
    parentFolder,
    navigateToParent,
    currentFolders,
  } = useFolderSelector();

  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading folders...</div>;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Select
          value={selectedFolder?.id}
          onValueChange={(value) => {
            selectFolder(value);
            onFolderSelect(value);
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select folder..." />
          </SelectTrigger>
          <SelectContent>
            {currentFolders.map((folder) => (
              <SelectItem key={folder.id} value={folder.id}>
                {folder.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={() => setIsCreateOpen(true)}>
          Create
        </Button>
      </div>

      {parentFolder && (
        <Button variant="ghost" size="sm" onClick={navigateToParent} className="text-xs">
          ← Back to {parentFolder.name}
        </Button>
      )}

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <CreateFolderForm
            parentId={selectedFolder?.id}
            onSuccess={(newFolder) => {
              selectFolder(newFolder.id);
              onFolderSelect(newFolder.id);
              setIsCreateOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
