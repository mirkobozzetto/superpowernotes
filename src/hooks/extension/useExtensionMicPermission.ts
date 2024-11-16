"use client";
import { useEffect, useState } from "react";

export const useExtensionMicPermission = () => {
  const [permission, setPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        await navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((stream) => {
            stream.getTracks().forEach((track) => track.stop());
            setPermission(true);
          })
          .catch(() => {
            setPermission(false);
          });
      } catch {
        setPermission(false);
      }
    };

    checkPermission();
  }, []);

  return permission;
};
