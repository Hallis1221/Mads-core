import { useSession, signIn, signOut } from "next-auth/react";
import NavBar from "../components/navbar";

export default function Page() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        <NavBar />
        <div className="w-screen h-full flex flex-col justify-center items-center">
          Signed in as {session.user?.email} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </div>
      </>
    );
  }
  return (
    <>
      <NavBar />
      <div className="w-screen h-screen flex flex-col justify-center items-center">
        Not signed in <br />
        <button onClick={() => signIn()}>Sign in</button>
      </div>
    </>
  );
}
