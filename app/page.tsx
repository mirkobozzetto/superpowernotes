import { Dashboard } from "@src/components/(landing)/_dashboard/Dashboard";
import { RotatingHeadline } from "@src/components/(landing)/_sections/RotatingHeadline";
import { Onboarding } from "@src/components/(landing)/Onboarding";
import { auth } from "@src/lib/auth/auth";

const headlines = [
  "N'attendez pas de perdre votre prochaine idée brillante",
  "Vos idées méritent d'être entendues",
] as const;

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex flex-col flex-grow items-center mx-auto px-4 sm:px-6 lg:px-8 pb-8 h-[calc(110vh-64px)] container">
      {!session && (
        <div className="w-full">
          <RotatingHeadline phrases={[...headlines]} className="mt-12" />
        </div>
      )}
      <div className="w-full">{session ? <Dashboard /> : <Onboarding />}</div>
    </main>
  );
}
