"use client";
import { useLastRecordedMessage } from "@src/hooks/useLastRecordedMessage";
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
  const [isRecording, setIsRecording] = useState(false);

  const { lastMessage, isLoading, error, isNewRecording } = useLastRecordedMessage(
    userId || "",
    shouldRefresh,
    isRecording
  );

  const handleRecordingComplete = useCallback(() => {
    setShouldRefresh(true);
  }, []);

  const handleRecordingStateChange = useCallback((recording: boolean) => {
    setIsRecording(recording);
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      {currentSession?.user ? (
        <>
          <AudioRecorder
            onRecordingComplete={handleRecordingComplete}
            onRecordingStateChange={handleRecordingStateChange}
          />
          <div className="mb-[10vh] w-full max-w-md">
            {isLoading ? (
              <p className="text-center">Loading last message...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : (
              <LastRecordedMessage voiceNote={lastMessage} isNewRecording={isNewRecording} />
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
