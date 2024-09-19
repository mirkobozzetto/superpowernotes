"use client";
import { signInAction } from "@src/lib/actions";

export default function SignIn() {
  return (
    <form action={signInAction} className="flex flex-col items-center justify-center">
      <button type="submit">Sign in with Google</button>
    </form>
  );
}
