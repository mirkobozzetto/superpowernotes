import DynamicAudioRecorder from "@src/components/recorder/DynamicAudioRecorder";
import { auth } from "@src/lib/auth/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-8 px-4">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 text-center">
        Super Power Notes
      </h1>
      <div className="w-full max-w-md">
        <DynamicAudioRecorder initialSession={session} />
      </div>
    </div>
  );
}
