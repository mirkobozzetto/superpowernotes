"use client";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { AudioRecorder } from "./AudioRecorder";

export const DynamicAudioRecorder = ({ initialSession }: { initialSession: Session | null }) => {
  const { data: session, status } = useSession();
  const currentSession = session ?? initialSession;

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <>
      {currentSession?.user ? <AudioRecorder /> : <p>Please sign in to start recording notes.</p>}
    </>
  );
};
