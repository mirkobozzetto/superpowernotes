import { auth } from "@/src/lib/auth/auth";
import SignIn from "./SignIn";
import SignOut from "./SignOut";

export default async function AuthButton() {
  const session = await auth();

  if (session && session.user) {
    return <SignOut />;
  } else {
    return <SignIn />;
  }
}
