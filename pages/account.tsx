import { useSession, signIn, signOut, getProviders } from "next-auth/react";
import SignInWithProvider from "../components/auth/signin";
import NavBar from "../components/navbar";

export default function AccountPage({ providers }: any) {
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
      <div className="w-screen flex flex-col justify-center items-center">
        Not signed in <br />
     <SignInWithProvider providers={providers}/>
      </div>
    </>
  );
}

export async function getServerSideProps(_: any) {
    const providers = await getProviders()
    return {
      props: { providers },
    }
  }