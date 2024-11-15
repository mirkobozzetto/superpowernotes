import { DynamicAudioRecorder } from "@src/components/recorder/DynamicAudioRecorder";
import { auth } from "@src/lib/auth/auth";
import { SessionProvider } from "next-auth/react";

export default async function RecorderEmbedPage() {
  const session = await auth();

  return (
    <>
      <SessionProvider>
        <DynamicAudioRecorder initialSession={session} showLastMessage={false} />
      </SessionProvider>
    </>
  );
}
