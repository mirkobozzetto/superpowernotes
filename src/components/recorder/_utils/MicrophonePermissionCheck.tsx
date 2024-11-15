import { useAudioHandlingStore } from "@src/stores/audioHandlingStore";
import { useEffect } from "react";

export const MicrophonePermissionCheck = ({
  onPermissionChange,
}: {
  onPermissionChange: (permission: boolean) => void;
}) => {
  const { isExtension } = useAudioHandlingStore();

  useEffect(() => {
    if (isExtension) {
      onPermissionChange(true);
      return;
    }

    const checkMicrophonePermission = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        onPermissionChange(true);
      } catch (err) {
        onPermissionChange(false);
      }
    };

    checkMicrophonePermission();
  }, [onPermissionChange, isExtension]);

  return null;
};
