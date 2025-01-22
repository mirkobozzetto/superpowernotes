"use client";

import { useSyncNotes } from "@src/hooks/_useDashboard/useSyncNotes";
import { useLastRecordedMessage } from "@src/hooks/useLastRecordedMessage";
import { useNoteManagerStore } from "@src/stores/noteManagerStore";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { AudioRecorder } from "./AudioRecorder";
import { LastRecordedMessage } from "./_ui/LastRecordedMessage";

export const DynamicAudioRecorder = ({
  initialSession,
  showLastMessage = true,
}: {
  initialSession: Session | null;
  showLastMessage?: boolean;
}) => {
  const { data: session, status } = useSession();
  const currentSession = session ?? initialSession;
  const userId = currentSession?.user?.id;

  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const {
    lastMessage,
    isLoading: isMessageLoading,
    error,
    isNewRecording,
  } = useLastRecordedMessage(userId || "", shouldRefresh, isRecording);

  const { notes, fetchNotes } = useNoteManagerStore();
  const { startSync, stopSync, isSyncing, isProcessing } = useSyncNotes({
    notes,
    fetchNotes,
  });

  useEffect(() => {
    if (!isProcessing && shouldRefresh) {
      setShouldRefresh(false);
    }
  }, [isProcessing, shouldRefresh]);

  const handleRecordingComplete = useCallback(() => {
    setShouldRefresh(true);
    startSync();
  }, [startSync]);

  const handleRecordingStateChange = useCallback(
    (recording: boolean) => {
      setIsRecording(recording);
      if (!recording) {
        stopSync();
      }
    },
    [stopSync]
  );

  const isLoading = isMessageLoading || isSyncing || isProcessing;

  return (
    <div className="flex flex-col items-center w-full">
      {currentSession?.user ? (
        <>
          <AudioRecorder
            onRecordingComplete={handleRecordingComplete}
            onRecordingStateChange={handleRecordingStateChange}
          />
          {showLastMessage && (
            <div className="mb-[10vh] w-full max-w-md">
              {isLoading ? (
                <p className="text-center">Chargement...</p>
              ) : error ? (
                <p className="text-center text-red-500">{error}</p>
              ) : (
                <LastRecordedMessage
                  voiceNote={lastMessage}
                  isNewRecording={isNewRecording}
                  isProcessing={isProcessing}
                />
              )}
            </div>
          )}
        </>
      ) : (
        <div className="mx-auto">
          <p className="p-4 font-light text-blue-700 text-center text-xs md:text-sm lg:text-2xl italic">
            {"Vous devez vous connecter pour utiliser cette fonctionnalité."}
          </p>
        </div>
      )}
    </div>
  );
};
