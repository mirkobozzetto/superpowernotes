"use client";
import { signInAction } from "@src/lib/actions";

export default function SignIn() {
  return (
    <form action={signInAction} className="flex flex-col items-center justify-center text-white">
      <button type="submit">Sign in</button>
    </form>
  );
}
