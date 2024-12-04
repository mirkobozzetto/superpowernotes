import { Button } from "@chadcn/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@chadcn/components/ui/dialog";
import { Input } from "@chadcn/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@chadcn/components/ui/select";
import { Textarea } from "@chadcn/components/ui/textarea";
import { useFolderSelector } from "@src/hooks/_useFolder/useFolderSelector";
import { useState } from "react";

type FolderSelectorProps = {
  onFolderSelect: (folderId: string | null) => void;
};

export const FolderSelector = ({ onFolderSelect }: FolderSelectorProps) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { currentFolders, selectedFolder, isLoading, error, selectFolder, refetchFolders } =
    useFolderSelector();

  const handleCreateFolder = async (data: { name: string; description?: string }) => {
    try {
      const response = await fetch("/api/folders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create folder");

      const newFolder = await response.json();
      await refetchFolders();
      selectFolder(newFolder.id);
      onFolderSelect(newFolder.id);
      setIsCreateOpen(false);
    } catch (err) {
      console.error("Error creating folder:", err);
    }
  };

  if (isLoading) {
    return <div className="text-gray-500">Loading folders...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const currentValue = selectedFolder?.id || "none";
  const currentName = selectedFolder ? selectedFolder.name : "Choisir un dossier";

  return (
    <div className="flex items-center justify-center gap-2 w-full">
      <Select
        value={currentValue}
        onValueChange={(value) => {
          selectFolder(value === "none" ? null : value);
          onFolderSelect(value === "none" ? null : value);
        }}
      >
        <SelectTrigger className="w-[200px] bg-white text-gray-900 rounded-full border-0 shadow-sm">
          <SelectValue>{currentName}</SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white rounded-lg">
          <SelectItem value="none" className="text-gray-900">
            Aucun dossier
          </SelectItem>
          {currentFolders.map((folder) => (
            <SelectItem key={folder.id} value={folder.id} className="text-gray-900">
              {folder.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        onClick={() => setIsCreateOpen(true)}
        className="bg-white hover:bg-gray-100 rounded-full shadow-sm border-0"
      >
        Nouveau dossier
      </Button>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-white sm:max-w-[425px] rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Créer un nouveau dossier</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              await handleCreateFolder({
                name: formData.get("name") as string,
                description: formData.get("description") as string,
              });
            }}
            className="space-y-4 mt-4"
          >
            <div className="space-y-2">
              <Input
                name="name"
                placeholder="Nom du dossier"
                className="w-full rounded-full"
                required
              />
            </div>
            <div className="space-y-2">
              <Textarea
                name="description"
                placeholder="Description (optionnel)"
                className="w-full min-h-[100px] rounded-lg"
              />
            </div>
            <Button type="submit" className="w-full rounded-full">
              Créer le dossier
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
