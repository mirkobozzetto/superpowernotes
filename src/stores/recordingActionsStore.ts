import { create } from "zustand";

type RecordingActionsState = {
  isRecording: boolean;
  isPaused: boolean;
  isProcessing: boolean;
  isFinishing: boolean;
  isCancelling: boolean;
  error: string | null;
  isSuccess: boolean;
  recordingTime: number;
  chunks: Blob[];
  startTime: number | null;
  timer: ReturnType<typeof setTimeout> | null;
  actualRecordingTime: number;

  setIsRecording: (isRecording: boolean) => void;
  setIsPaused: (isPaused: boolean) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setIsFinishing: (isFinishing: boolean) => void;
  setIsCancelling: (isCancelling: boolean) => void;
  setError: (error: string | null) => void;
  setIsSuccess: (isSuccess: boolean) => void;
  setRecordingTime: (time: number | ((prevTime: number) => number)) => void;
  setStartTime: (time: number | null) => void;
  setTimer: (timer: ReturnType<typeof setTimeout> | null) => void;
  addChunk: (chunk: Blob) => void;
  clearChunks: () => void;
  incrementActualRecordingTime: () => void;
  resetActualRecordingTime: () => void;
};

export const useRecordingActionsStore = create<RecordingActionsState>((set, _get) => ({
  isRecording: false,
  isPaused: false,
  isProcessing: false,
  isFinishing: false,
  isCancelling: false,
  error: null,
  isSuccess: false,
  recordingTime: 0,
  chunks: [],
  startTime: null,
  timer: null,
  actualRecordingTime: 0,

  setIsRecording: (isRecording) => set({ isRecording }),
  setIsPaused: (isPaused) => set({ isPaused }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  setIsFinishing: (isFinishing) => set({ isFinishing }),
  setIsCancelling: (isCancelling) => set({ isCancelling }),
  setError: (error) => set({ error }),
  setIsSuccess: (isSuccess) => set({ isSuccess }),
  setRecordingTime: (time) =>
    set((state) => ({
      recordingTime: typeof time === "function" ? time(state.recordingTime) : time,
    })),
  setStartTime: (time) => set({ startTime: time }),
  setTimer: (timer) => set({ timer }),
  addChunk: (chunk) => set((state) => ({ chunks: [...state.chunks, chunk] })),
  clearChunks: () => set({ chunks: [] }),
  incrementActualRecordingTime: () =>
    set((state) => ({ actualRecordingTime: state.actualRecordingTime + 1 })),
  resetActualRecordingTime: () => set({ actualRecordingTime: 0 }),
}));
