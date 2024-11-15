"use client";
import { DynamicAudioRecorder } from "@src/components/recorder/DynamicAudioRecorder";
import { useAudioHandlingStore } from "@src/stores/audioHandlingStore";
import type { Session } from "next-auth";
import { useEffect } from "react";

type Props = {
  session: Session | null;
};

export const RecorderInit = ({ session }: Props) => {
  const initializeForExtension = useAudioHandlingStore((state) => state.initializeForExtension);

  useEffect(() => {
    initializeForExtension();
  }, [initializeForExtension]);

  return <DynamicAudioRecorder initialSession={session} showLastMessage={false} />;
};
