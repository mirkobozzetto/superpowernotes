"use client";
import { Button } from "@chadcn/components/ui/button";
import { signInAction } from "@src/lib/actions";

export default function SignIn() {
  return (
    <form action={signInAction} className="flex flex-col justify-center items-center text-white">
      <Button
        type="submit"
        variant="ghost"
        className="hover:bg-gray-800 rounded-full text-white hover:text-white"
      >
        Sign in
      </Button>
    </form>
  );
}
