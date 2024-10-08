import { DynamicAudioRecorder } from "@src/components/recorder/DynamicAudioRecorder";
import { auth } from "@src/lib/auth/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex flex-col flex-grow items-center mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-64px)] overflow-hidden container">
      <h1 className="mb-4 font-bold text-2xl text-center lg:text-5xl">Super Power Notes</h1>
      <p className="mb-12 font-light text-center text-sm lg:text-2xl">
        Remember everything you need
      </p>
      <div className="w-full max-w-sm">
        <DynamicAudioRecorder initialSession={session} />
      </div>
    </main>
  );
}
