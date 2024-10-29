"use client";

import { Button } from "@chadcn/components/ui/button";
import { cn } from "@chadcn/lib/utils";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { AuthModal } from "./AuthModal";
import SignOut from "./SignOut";

interface AuthButtonProps {
  children?: React.ReactNode;
  className?: string;
  useCustomStyles?: boolean;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  children,
  className,
  useCustomStyles = false,
}) => {
  const { data: session, status } = useSession();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  if (status === "loading") {
    return (
      <Button variant="ghost" className={cn("text-white", className)} disabled>
        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  if (session && session.user) {
    return <SignOut />;
  }

  const buttonContent = children || "Sign In";
  return (
    <>
      {useCustomStyles ? (
        <button onClick={() => setIsAuthModalOpen(true)} className={className}>
          {buttonContent}
        </button>
      ) : (
        <Button
          variant="ghost"
          onClick={() => setIsAuthModalOpen(true)}
          className={cn("hover:bg-gray-800 text-white hover:text-white", className)}
        >
          {buttonContent}
        </Button>
      )}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default AuthButton;
