import { useNoteManagerStore } from "@src/stores/noteManagerStore";

export const FolderHeader = () => {
  const { selectedFolderId, rootFolders, subFolders } = useNoteManagerStore();

  const findSelectedFolder = () => {
    if (!selectedFolderId) return null;

    const folder = rootFolders.find((f) => f.id === selectedFolderId);
    if (folder) return folder;

    for (const subFolderArray of Object.values(subFolders)) {
      const found = subFolderArray.find((f) => f.id === selectedFolderId);
      if (found) return found;
    }
    return null;
  };

  const selectedFolder = findSelectedFolder();

  if (!selectedFolderId) {
    return (
      <div className="py-4 text-center">
        <h2 className="text-xl font-semibold mb-1">Toutes mes notes</h2>
      </div>
    );
  }

  if (!selectedFolder) return null;

  return (
    <div className="py-4 text-center bort border-gray-200  w-1/2 mx-auto">
      <h2 className="text-xl font-semibold">{selectedFolder.name}</h2>
      {selectedFolder.description && (
        <p className="text-gray-600 text-sm">{selectedFolder.description}</p>
      )}
    </div>
  );
};
