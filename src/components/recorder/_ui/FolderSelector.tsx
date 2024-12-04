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
import { cn } from "@chadcn/lib/utils";
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

      if (!response.ok) throw new Error("Échec de la création du projet");

      const newFolder = await response.json();
      await refetchFolders();
      selectFolder(newFolder.id);
      onFolderSelect(newFolder.id);
      setIsCreateOpen(false);
    } catch (err) {
      console.error("Erreur lors de la création du projet:", err);
    }
  };

  if (isLoading) {
    return <div className="text-gray-500">Chargement des projets...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const currentValue = selectedFolder?.id || "none";
  const currentName = selectedFolder ? selectedFolder.name : "Choisir un projet";

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
        <SelectContent
          className={cn(
            "bg-white rounded-lg py-2 overflow-hidden",
            "border border-gray-200 shadow-lg"
          )}
        >
          <SelectItem
            value="none"
            className={cn(
              "text-gray-900 text-sm py-2.5 pl-4 cursor-pointer",
              "hover:bg-blue-50 focus:bg-blue-50 outline-none",
              "transition-colors duration-150"
            )}
          >
            {`Choisir un projet`}
          </SelectItem>
          {currentFolders.map((folder) => (
            <SelectItem
              key={folder.id}
              value={folder.id}
              className={cn(
                "text-gray-900 text-sm py-2.5 pl-4 pr-8 cursor-pointer relative",
                "hover:bg-blue-50 focus:bg-blue-50 outline-none",
                "transition-colors duration-150"
              )}
            >
              <span className="block truncate">{folder.name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        onClick={() => setIsCreateOpen(true)}
        className={cn(
          "bg-white hover:bg-blue-50",
          "rounded-full shadow-sm border-0",
          "transition-colors duration-150"
        )}
      >
        Nouveau projet
      </Button>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className={cn("bg-white sm:max-w-[425px] rounded-lg", "border-0 shadow-xl")}>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Créer un nouveau projet
            </DialogTitle>
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
                placeholder="Nom du projet"
                className={cn(
                  "w-full rounded-full",
                  "border-gray-200 focus:border-blue-300",
                  "transition-colors duration-150"
                )}
                required
              />
            </div>
            <div className="space-y-2">
              <Textarea
                name="description"
                placeholder="Description (optionnel)"
                className={cn(
                  "w-full min-h-[100px] rounded-full",
                  "border-gray-200 focus:border-blue-300",
                  "transition-colors duration-150",
                  "resize-none"
                )}
              />
            </div>
            <Button
              type="submit"
              className={cn(
                "w-full rounded-full",
                "bg-blue-500 hover:bg-blue-600",
                "text-white font-medium",
                "transition-colors duration-150"
              )}
            >
              Créer le projet
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
