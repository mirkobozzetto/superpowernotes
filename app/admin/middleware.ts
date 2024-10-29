import { auth } from "@src/lib/auth/auth";
import { redirect } from "next/navigation";

export async function adminAuthMiddleware() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }
}
