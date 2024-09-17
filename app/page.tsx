import AuthButton from "@/src/components/auth/AuthButton";
import { auth } from "@/src/lib/auth/auth";

export default async function Home() {
  const session = await auth();

  return (
    <>
      <AuthButton />
      {session?.user && <pre>{JSON.stringify(session.user, null, 2)}</pre>}
    </>
  );
}
