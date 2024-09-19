import { signIn } from "@/src/lib/auth/auth";

export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
      className="flex flex-col items-center justify-center"
    >
      <button type="submit">Signin with Google</button>
    </form>
  );
}
