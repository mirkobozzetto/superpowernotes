import type { Folder, VoiceNote } from "@prisma/client";
import { folderService } from "@src/services/folderService";
import { voiceNotesService } from "@src/services/voiceNotesService";
import type {
  SearchParamsType,
  VoiceNoteUpdateInput,
} from "@src/validations/routes/voiceNoteRoutes";
import { create } from "zustand";

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
};

type Actions = {
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

  setError: (error) => set({ error }),
  setLoading: (isLoading) => set({ isLoading }),

  selectFolder: async (folderId) => {
    const store = get();
    store.setLoading(true);
    try {
      if (folderId) {
        const notes = await folderService.getFolderNotes(folderId);
        set({ notes, selectedFolderId: folderId });
      } else {
        const { notes: fetchedNotes } = await voiceNotesService.getAllNotes();
        set({ notes: fetchedNotes, selectedFolderId: null });
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
    store.setLoading(true);
    try {
      const folders = await folderService.getFolders();
      const rootFolders = store.computeRootFolders(folders);
      const subFolders = store.computeSubFolders(folders);
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
      const response = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create folder");
      await store.fetchFolders();
    } catch (error) {
      store.setError("Failed to create folder");
    } finally {
      store.setLoading(false);
    }
  },
}));
