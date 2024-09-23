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
      {currentSession?.user ? (
        <AudioRecorder />
      ) : (
        <div className=" mx-auto ">
          <p className="text-center bg-green-50 p-4 rounded-full text-green-500">
            {`Don't wait a moment longer to get connected !`}
          </p>
        </div>
      )}
    </>
  );
};
