import { auth } from "@/src/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headersList = headers();
  const pathname = headersList.get("x-invoke-path") || "";
  console.log("Middleware called for path:", pathname);
  const session = await auth();
  console.log("Session in middleware:", session);
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <>
      <main>{children}</main>
    </>
  );
}
