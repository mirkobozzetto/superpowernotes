import { useState } from "react";

type CopyStatus = {
  isCopied: boolean;
  error: string | null;
};

type UseCopyToClipboardResult = {
  copyToClipboard: (text: string) => Promise<void>;
  isCopied: boolean;
  error: string | null;
};

export const useCopyToClipboard = (): UseCopyToClipboardResult => {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>({
    isCopied: false,
    error: null,
  });

  const resetCopyStatus = () => {
    setCopyStatus({ isCopied: false, error: null });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus({ isCopied: true, error: null });
      setTimeout(resetCopyStatus, 2000);
    } catch (err) {
      setCopyStatus({
        isCopied: false,
        error: "Failed to copy to clipboard",
      });
    }
  };

  return {
    copyToClipboard,
    isCopied: copyStatus.isCopied,
    error: copyStatus.error,
  };
};
