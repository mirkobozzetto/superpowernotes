import { Button } from "@chadcn/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "@chadcn/components/ui/dialog";
import { Input } from "@chadcn/components/ui/input";
import { Label } from "@chadcn/components/ui/label";
import { Textarea } from "@chadcn/components/ui/textarea";
import type { Folder } from "@generated/prisma/client";
import { useState } from "react";

type CreateFolderFormProps = {
  parentId?: string | null;
  onSuccess: (folder: Folder) => void;
};

export const CreateFolderForm = ({ parentId, onSuccess }: CreateFolderFormProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/folders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          parentId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create folder");
      }

      const folder = await response.json();
      onSuccess(folder);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create New Folder</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Folder name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Folder description"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Folder"}
        </Button>
      </form>
    </DialogContent>
  );
};
