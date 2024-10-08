"use client";
import { Button } from "@chadcn/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignOut() {
  const { update } = useSession();
  const router = useRouter();

  const handleSignOut = async (event: React.FormEvent) => {
    event.preventDefault();
    await signOut({ redirect: false });
    await update();
    router.push("/");
    router.refresh();
  };

  return (
    <form onSubmit={handleSignOut}>
      <Button
        type="submit"
        variant="ghost"
        className="hover:bg-gray-800 rounded-full text-white hover:text-white"
      >
        Sign out
      </Button>
    </form>
  );
}
