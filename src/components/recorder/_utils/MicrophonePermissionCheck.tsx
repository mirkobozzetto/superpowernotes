import { useEffect } from "react";

interface Props {
  onPermissionChange: (hasPermission: boolean) => void;
}

export const MicrophonePermissionCheck = ({ onPermissionChange }: Props) => {
  useEffect(() => {
    const checkMicrophonePermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
        onPermissionChange(true);
      } catch (error) {
        onPermissionChange(false);
      }
    };

    checkMicrophonePermission();
  }, [onPermissionChange]);

  return null;
};
