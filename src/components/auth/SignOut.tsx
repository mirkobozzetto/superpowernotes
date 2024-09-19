"use client";
import { signOutAction } from "@src/lib/actions";

export default function SignOut() {
  return (
    <form action={signOutAction}>
      <button type="submit">Sign out</button>
    </form>
  );
}
