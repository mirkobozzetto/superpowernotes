import React, { useCallback, useEffect } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  message: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  const handleOutsideClick = useCallback(
    (event: MouseEvent) => {
      const modalContent = document.querySelector(".modal-content");
      if (modalContent && event.target && !modalContent.contains(event.target as Node)) {
        onClose();
      }
    },
    [onClose]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleOutsideClick, handleKeyDown]);

  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  if (!isOpen) return null;

  /**
   * This function escapes special HTML characters to prevent XSS attacks
   * which automatically escapes HTML. Keeping it for reference or future use.
   */
  const escapeHtml = (unsafe: string) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-2xl modal-content">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="mb-4">{escapeHtml(message)}</p>
        <div className="flex justify-end">
          <button onClick={onClose} className="mr-2 px-4 py-2 border rounded-full">
            Cancel
          </button>
          <button onClick={handleConfirm} className="px-4 py-2 border rounded-full">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
