import DynamicAudioRecorder from "@src/components/recorder/DynamicAudioRecorder";
import { auth } from "@src/lib/auth/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Welcome to Voice Powered Notes</h1>
      <DynamicAudioRecorder initialSession={session} />
    </div>
  );
}
