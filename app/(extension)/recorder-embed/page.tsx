import { RecorderInit } from "@src/components/(extension)/RecorderInit";
import { auth } from "@src/lib/auth/auth";
import { SessionProvider } from "next-auth/react";

export default async function RecorderEmbedPage() {
  const session = await auth();

  return (
    <SessionProvider>
      <RecorderInit session={session} />
    </SessionProvider>
  );
}
