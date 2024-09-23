import { DynamicAudioRecorder } from "@src/components/recorder/DynamicAudioRecorder";
import { auth } from "@src/lib/auth/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex flex-col items-center px-4 sm:px-8">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-center">
        Super Power Notes
      </h1>
      <p className="text-lg sm:text-xl lg:text-2xl text-center font-light mb-24">
        Remember everything you need
      </p>
      <div className="w-full max-w-md">
        <DynamicAudioRecorder initialSession={session} />
      </div>
    </div>
  );
}
