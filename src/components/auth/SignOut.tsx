"use client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignOut() {
  const { update } = useSession();
  const router = useRouter();

  const handleSignOut = async (event: React.FormEvent) => {
    event.preventDefault();
    await signOut({ redirect: false });
    await update();
    router.refresh();
  };

  return (
    <form onSubmit={handleSignOut}>
      <button type="submit">Sign out</button>
    </form>
  );
}
