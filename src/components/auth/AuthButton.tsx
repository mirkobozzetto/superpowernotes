"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import { AuthModal } from "./AuthModal";
import SignOut from "./SignOut";

const AuthButton: React.FC = () => {
  const { data: session, status } = useSession();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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
    return (
      <>
        <button onClick={() => setIsAuthModalOpen(true)} className="text-white">
          Sign In
        </button>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </>
    );
  }
};

export default AuthButton;
