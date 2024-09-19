"use client";
import { signOut, useSession } from "next-auth/react";

export default function SignOut() {
  const { update } = useSession();

  const handleSignOut = async (event: React.FormEvent) => {
    event.preventDefault();
    await signOut({ redirect: false });
    await update();
  };

  return (
    <form onSubmit={handleSignOut}>
      <button type="submit">Sign out</button>
    </form>
  );
}
