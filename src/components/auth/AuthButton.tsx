"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import SignIn from "./SignIn";
import SignOut from "./SignOut";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="text-white text-center">Loading...</div>;
  }

  if (session && session.user) {
    return (
      <div className="flex space-x-4 text-white">
        {session.user.role === "ADMIN" && <Link href="/admin">Admin Panel</Link>}
        <SignOut />
      </div>
    );
  } else {
    return <SignIn />;
  }
}
