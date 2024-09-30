import { useCallback, useEffect, useRef } from "react";

interface Props {
  onPermissionChange: (hasPermission: boolean) => void;
}

export const MicrophonePermissionCheck = ({ onPermissionChange }: Props) => {
  const onPermissionChangeRef = useRef<(hasPermission: boolean) => void>();

  useEffect(() => {
    onPermissionChangeRef.current = onPermissionChange;
  });

  const checkMicrophonePermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      if (onPermissionChangeRef.current) {
        onPermissionChangeRef.current(true);
      }
    } catch (error) {
      if (onPermissionChangeRef.current) {
        onPermissionChangeRef.current(false);
      }
    }
  }, []);

  useEffect(() => {
    checkMicrophonePermission();
  }, [checkMicrophonePermission]);

  return null;
};
