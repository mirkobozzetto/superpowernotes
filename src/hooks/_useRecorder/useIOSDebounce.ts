import { useRef } from "react";

type DebounceFunction = (callback: () => Promise<void>) => Promise<void>;

export const useIOSDebounce = (delay: number = 1000): DebounceFunction => {
  const processingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debounce: DebounceFunction = async (callback) => {
    if (processingRef.current) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    processingRef.current = true;

    timeoutRef.current = setTimeout(async () => {
      try {
        await callback();
      } finally {
        processingRef.current = false;
      }
    }, delay);
  };

  return debounce;
};
