import type { Folder, VoiceNote } from "@generated/prisma/client";
import { folderService } from "@src/services/folderService";
import { voiceNotesService } from "@src/services/voiceNotesService";
import type {
  SearchParamsType,
  VoiceNoteUpdateInput,
} from "@src/validations/routes/voiceNoteRoutes";
import { create } from "zustand";
import { useFolderCache } from "./folderCacheStore";

const SELECTED_FOLDER_KEY = "lastSelectedFolder";

type FolderMap = { [key: string]: Folder[] };

type State = {
  notes: VoiceNote[];
  folders: Folder[];
  selectedFolderId: string | null;
  rootFolders: Folder[];
  subFolders: FolderMap;
  searchParams: SearchParamsType;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
};

type Actions = {
  initialize: () => Promise<void>;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  selectFolder: (folderId: string | null) => Promise<void>;
  fetchNotes: () => Promise<void>;
  fetchFolders: () => Promise<void>;
  handleSearch: (e: React.FormEvent) => Promise<void>;
  updateSearchParams: (name: string, value: string) => void;
  saveNote: (note: VoiceNoteUpdateInput & { id?: string }) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  computeRootFolders: (folders: Folder[]) => Folder[];
  computeSubFolders: (folders: Folder[]) => FolderMap;
  createFolder: (data: Pick<Folder, "name" | "description">) => Promise<void>;
  setNotes: (notes: VoiceNote[]) => void;
};

type NoteManagerStore = State & Actions;

export const useNoteManagerStore = create<NoteManagerStore>((set, get) => ({
  notes: [],
  folders: [],
  selectedFolderId: null,
  rootFolders: [],
  subFolders: {},
  searchParams: {
    tags: "",
    startDate: "",
    endDate: "",
    keyword: "",
  },
  isLoading: false,
  error: null,
  isInitialized: false,

  initialize: async () => {
    const store = get();
    if (store.isInitialized) return;

    const savedFolderId = localStorage.getItem(SELECTED_FOLDER_KEY);
    if (savedFolderId) {
      await store.selectFolder(savedFolderId);
    } else {
      await store.fetchNotes();
    }

    set({ isInitialized: true });
  },

  setError: (error) => set({ error }),
  setLoading: (isLoading) => set({ isLoading }),

  selectFolder: async (folderId) => {
    const store = get();
    store.setLoading(true);
    try {
      if (folderId) {
        const notes = await folderService.getFolderNotes(folderId);
        set({ notes, selectedFolderId: folderId });
        localStorage.setItem(SELECTED_FOLDER_KEY, folderId);
      } else {
        const { notes: fetchedNotes } = await voiceNotesService.getAllNotes();
        set({ notes: fetchedNotes, selectedFolderId: null });
        localStorage.removeItem(SELECTED_FOLDER_KEY);
      }
    } catch (error) {
      store.setError("Failed to fetch notes for selected folder");
    } finally {
      store.setLoading(false);
    }
  },

  fetchNotes: async () => {
    const store = get();
    store.setLoading(true);
    try {
      if (store.selectedFolderId) {
        const notes = await folderService.getFolderNotes(store.selectedFolderId);
        set({ notes });
      } else {
        const { notes: fetchedNotes } = await voiceNotesService.getAllNotes();
        set({ notes: fetchedNotes });
      }
    } catch (error) {
      store.setError("Failed to fetch notes");
    } finally {
      store.setLoading(false);
    }
  },

  fetchFolders: async () => {
    const store = get();
    const folderCache = useFolderCache.getState();

    if (folderCache.cachedFolders) {
      set({
        folders: folderCache.cachedFolders.folders,
        rootFolders: folderCache.cachedFolders.rootFolders,
        subFolders: folderCache.cachedFolders.subFolders,
      });
    }

    store.setLoading(true);
    try {
      const folders = await folderService.getFolders();
      const rootFolders = store.computeRootFolders(folders);
      const subFolders = store.computeSubFolders(folders);

      folderCache.setCachedFolders({
        folders,
        rootFolders,
        subFolders,
      });

      set({ folders, rootFolders, subFolders });
    } catch (error) {
      store.setError("Failed to fetch folders");
    } finally {
      store.setLoading(false);
    }
  },

  handleSearch: async (e) => {
    e.preventDefault();
    const store = get();
    store.setLoading(true);
    try {
      const params = {
        ...store.searchParams,
        ...(store.selectedFolderId && { folderId: store.selectedFolderId }),
      };
      const notes = await voiceNotesService.searchNotes(params);
      set({ notes });
    } catch (error) {
      store.setError("Search failed");
    } finally {
      store.setLoading(false);
    }
  },

  updateSearchParams: (name, value) => {
    set((state) => ({
      searchParams: { ...state.searchParams, [name]: value },
    }));
  },

  saveNote: async (note) => {
    const store = get();
    store.setLoading(true);
    try {
      await voiceNotesService.saveNote(note);
      await store.fetchNotes();
    } catch (error) {
      store.setError("Failed to save note");
    } finally {
      store.setLoading(false);
    }
  },

  deleteNote: async (noteId) => {
    const store = get();
    store.setLoading(true);
    try {
      await voiceNotesService.deleteNote(noteId);
      set((state) => ({
        notes: state.notes.filter((note) => note.id !== noteId),
      }));
    } catch (error) {
      store.setError("Failed to delete note");
    } finally {
      store.setLoading(false);
    }
  },

  computeRootFolders: (folders) => {
    return folders.filter((folder) => !folder.parentId);
  },

  computeSubFolders: (folders) => {
    return folders.reduce<FolderMap>((acc, folder) => {
      if (folder.parentId) {
        if (!acc[folder.parentId]) {
          acc[folder.parentId] = [];
        }
        acc[folder.parentId].push(folder);
      }
      return acc;
    }, {});
  },

  createFolder: async (data) => {
    const store = get();
    store.setLoading(true);
    try {
      const result = await folderService.createFolder(data);
      if (result.error) {
        store.setError(result.error.message);
        return;
      }
      useFolderCache.getState().clearCache();
      await store.fetchFolders();
    } catch (error) {
      store.setError("Failed to create folder");
    } finally {
      store.setLoading(false);
    }
  },

  setNotes: (notes) => set({ notes }),
}));
