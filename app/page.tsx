import { DynamicAudioRecorder } from "@src/components/recorder/DynamicAudioRecorder";
import { auth } from "@src/lib/auth/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-hidden flex flex-col items-center  h-[calc(100vh-64px)]">
      <h1 className="text-2xl lg:text-5xl font-bold mb-4 text-center">Super Power Notes</h1>
      <p className="text-sm lg:text-2xl text-center font-light mb-12">
        Remember everything you need
      </p>
      <div className="w-full max-w-sm">
        <DynamicAudioRecorder initialSession={session} />
      </div>
    </main>
  );
}
