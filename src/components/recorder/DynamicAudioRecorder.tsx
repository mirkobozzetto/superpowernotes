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
        <p className="inline-block border-gray-100 bg-gray-50 px-4 py-2 border rounded-full text-center text-gray-500 text-sm animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="">
      {currentSession?.user ? (
        <AudioRecorder />
      ) : (
        <div className="mx-auto">
          <p
            className="p-4 font-light text-blue-700 text-center text-xs md:text-sm
           lg:text-2xl italic"
          >
            {"Sign in to start recording your audio notes"}
          </p>
        </div>
      )}
    </div>
  );
};
