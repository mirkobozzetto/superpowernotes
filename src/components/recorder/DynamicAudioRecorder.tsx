"use client";
import { useLastRecordedMessage } from "@src/hooks/recorder/useLastRecordedMessage";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useState } from "react";
import { AudioRecorder } from "./AudioRecorder";
import { LastRecordedMessage } from "./_ui/LastRecordedMessage";

export const DynamicAudioRecorder = ({ initialSession }: { initialSession: Session | null }) => {
  const { data: session, status } = useSession();
  const currentSession = session ?? initialSession;
  const userId = currentSession?.user?.id;

  const [shouldRefresh, setShouldRefresh] = useState(false);

  const { lastMessage, isLoading, error, refreshLastMessage } = useLastRecordedMessage(
    userId || "",
    shouldRefresh
  );

  const handleRecordingComplete = useCallback(() => {
    setShouldRefresh(true);
  }, []);

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
    <div className="flex flex-col items-center w-full">
      {currentSession?.user ? (
        <>
          <AudioRecorder onRecordingComplete={handleRecordingComplete} />
          <div className="mt-8 w-full max-w-md">
            {isLoading ? (
              <p className="text-center">Loading last message...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : (
              <LastRecordedMessage voiceNote={lastMessage} />
            )}
          </div>
        </>
      ) : (
        <div className="mx-auto">
          <p className="p-4 font-light text-blue-700 text-center text-xs md:text-sm lg:text-2xl italic">
            {"Sign in to start recording your audio notes"}
          </p>
        </div>
      )}
    </div>
  );
};
