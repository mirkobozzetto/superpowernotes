import { auth } from "@/src/lib/auth/auth";
import Link from "next/link";
import SignIn from "./SignIn";
import SignOut from "./SignOut";

export default async function AuthButton() {
  const session = await auth();
  console.log("Session:", session);
  if (session && session.user) {
    console.log("Session:", session);
    return (
      <div>
        {session.user.role === "ADMIN" && <Link href="/admin">Admin Panel</Link>}
        <SignOut />
      </div>
    );
  } else {
    return <SignIn />;
  }
}
