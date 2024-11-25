"use client";

import { useAudioHandlingStore } from "@src/stores/audioHandlingStore";
import { useEffect } from "react";

export const MicrophonePermissionCheck = ({
  onPermissionChange,
}: {
  onPermissionChange: (permission: boolean) => void;
}) => {
  const { isExtension, debugLog } = useAudioHandlingStore();

  useEffect(() => {
    const checkMicrophonePermission = async () => {
      debugLog("Checking microphone permissions");

      try {
        const constraints = {
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        };

        debugLog("Requesting microphone access with constraints:", constraints);
        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        debugLog("Got microphone access, checking tracks");
        const audioTracks = stream.getAudioTracks();
        debugLog(
          "Audio tracks:",
          audioTracks.map((track) => ({
            kind: track.kind,
            label: track.label,
            enabled: track.enabled,
          }))
        );

        stream.getTracks().forEach((track) => track.stop());
        debugLog("Successfully checked microphone permission");
        onPermissionChange(true);
      } catch (error) {
        debugLog("Initial microphone check failed:", error);

        if (isExtension) {
          debugLog("Retrying for extension with basic audio");
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach((track) => track.stop());
            debugLog("Extension microphone check successful");
            onPermissionChange(true);
          } catch (extError) {
            debugLog("Extension microphone check failed:", extError);
            onPermissionChange(false);
          }
        } else {
          debugLog("Web microphone check failed:", error);
          onPermissionChange(false);
        }
      }
    };

    checkMicrophonePermission();
  }, [onPermissionChange, isExtension, debugLog]);

  return null;
};
