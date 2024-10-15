import { Onboarding } from "@src/components/(landing)/Onboarding";
import { DynamicAudioRecorder } from "@src/components/recorder/DynamicAudioRecorder";
import { auth } from "@src/lib/auth/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex flex-col flex-grow items-center mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-64px)] container">
      <h1 className="bg-clip-text bg-gradient-to-r from-blue-950 to-blue-500 mb-4 font-extrabold text-3xl text-center text-transparent md:text-5xl lg:text-7xl">
        Super Power Notes
      </h1>
      <div className="w-full">
        {session ? <DynamicAudioRecorder initialSession={session} /> : <Onboarding />}
      </div>
    </main>
  );
}
