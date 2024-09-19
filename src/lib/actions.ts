"use server";

import { signIn, signOut } from "@src/lib/auth/auth";

export async function signInAction() {
  await signIn("google");
}

export async function signOutAction() {
  await signOut();
}
