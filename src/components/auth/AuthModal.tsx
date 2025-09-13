import { cn } from "@chadcn/lib/utils";
import { signInAction } from "@src/lib/actions";
import { signIn } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { HiMail } from "react-icons/hi";
import { ModalPortal } from "../utils/ModalPortal";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInAction();
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn("resend", { email, callbackUrl: "/" });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalPortal>
      <div
        className="z-50 fixed inset-0 flex justify-center items-start md:items-center bg-gray-900/40 backdrop-blur-md pt-[5vh] md:pt-0 transition-all duration-200"
        style={{
          top: "64px",
          height: "calc(100vh - 64px)",
        }}
        onClick={onClose}
      >
        <div
          className={cn("bg-white shadow-xl mx-4 p-8 rounded-lg w-full max-w-md", "relative z-10")}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="mb-6 font-bold text-2xl text-center text-gray-800">Sign In</h2>

          <button
            onClick={handleGoogleSignIn}
            className={cn(
              "flex justify-center items-center w-full",
              "border border-gray-300 bg-white hover:bg-gray-50",
              "mb-4 px-6 py-3 rounded-full",
              "text-gray-700 transition-colors duration-200"
            )}
            disabled={isLoading}
          >
            <FcGoogle className="mr-2 text-xl" />
            Sign in with Google
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="bg-gradient-to-r from-transparent via-gray-300 to-transparent w-full h-px"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <form onSubmit={handleMagicLinkSignIn} className="space-y-4">
            <div className="relative flex items-center">
              <HiMail className="left-3 z-10 absolute text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={cn(
                  "w-full px-4 py-2 pl-10",
                  "border border-gray-300 rounded-full",
                  "focus:ring-2 focus:ring-blue-500 focus:outline-none",
                  "text-center"
                )}
                required
              />
            </div>
            <button
              type="submit"
              className={cn(
                "flex justify-center items-center w-full",
                "bg-blue-500 hover:bg-blue-600",
                "px-6 py-3 rounded-full",
                "text-white transition-colors duration-200"
              )}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Send Magic Link"}
            </button>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
};
