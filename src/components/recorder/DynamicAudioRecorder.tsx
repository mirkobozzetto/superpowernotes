"use client";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { AudioRecorder } from "./AudioRecorder";

export const DynamicAudioRecorder = ({ initialSession }: { initialSession: Session | null }) => {
  const { data: session, status } = useSession();
  const currentSession = session ?? initialSession;

  if (status === "loading") {
    return (
      <div className="flex justify-center">
        <p className="inline-block text-center text-gray-500 text-sm animate-pulse bg-gray-50 border border-gray-100 rounded-full px-4 py-2">
          Loading...
        </p>
      </div>
    );
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
