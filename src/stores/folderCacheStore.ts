import type { Folder } from "@generated/prisma/client";
import { create } from "zustand";

export type LocalFolderCache = {
  folders: Folder[];
  rootFolders: Folder[];
  subFolders: { [key: string]: Folder[] };
};

export type FolderCacheState = {
  cachedFolders: LocalFolderCache | null;
  setCachedFolders: (cache: LocalFolderCache) => void;
  clearCache: () => void;
};

export const useFolderCache = create<FolderCacheState>((set) => ({
  cachedFolders: null,
  setCachedFolders: (cache) => set({ cachedFolders: cache }),
  clearCache: () => set({ cachedFolders: null }),
}));
