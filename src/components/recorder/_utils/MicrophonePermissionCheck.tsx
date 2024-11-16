"use client";

import { useAudioHandlingStore } from "@src/stores/audioHandlingStore";
import { useEffect } from "react";

export const MicrophonePermissionCheck = ({
  onPermissionChange,
}: {
  onPermissionChange: (permission: boolean) => void;
}) => {
  const { isExtension } = useAudioHandlingStore();

  useEffect(() => {
    const checkMicrophonePermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
        onPermissionChange(true);
      } catch (error) {
        if (isExtension) {
          try {
            await navigator.mediaDevices.getUserMedia({
              audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
              },
            });
            onPermissionChange(true);
          } catch (extError) {
            console.error("Extension mic error:", extError);
            onPermissionChange(false);
          }
        } else {
          console.error("Web mic error:", error);
          onPermissionChange(false);
        }
      }
    };

    checkMicrophonePermission();
  }, [onPermissionChange, isExtension]);

  return null;
};
