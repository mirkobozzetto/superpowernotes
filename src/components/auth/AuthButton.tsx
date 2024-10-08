"use client";

import { Button } from "@chadcn/components/ui/button";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import { AuthModal } from "./AuthModal";
import SignOut from "./SignOut";

const AuthButton: React.FC = () => {
  const { data: session, status } = useSession();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  if (status === "loading") {
    return (
      <Button variant="ghost" className="text-white" disabled>
        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  if (session && session.user) {
    return (
      <div className="flex items-center space-x-4">
        {session.user.role === "ADMIN" && (
          <Button
            variant="ghost"
            asChild
            className="hover:bg-gray-800 rounded-full text-white hover:text-white"
          >
            <Link href="/admin">Admin Panel</Link>
          </Button>
        )}
        <SignOut />
      </div>
    );
  } else {
    return (
      <>
        <Button
          variant="ghost"
          onClick={() => setIsAuthModalOpen(true)}
          className="hover:bg-gray-800 text-white hover:text-white"
        >
          Sign In
        </Button>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </>
    );
  }
};

export default AuthButton;
