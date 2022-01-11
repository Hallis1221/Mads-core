import {
  signIn,
  SignInAuthorisationParams,
  SignInOptions,
} from "next-auth/react";

export default function MagicEmailSignin({email}: {email: string}) {
  return (
    <button onClick={() => signIn("email", { email: "halvorviv@gmail.com" })}>
      Sign in with email.
    </button>
  );
}
