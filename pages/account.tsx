import { useSession , signOut, getProviders } from "next-auth/react";
import { useEffect, useState } from "react";
import MagicEmailSignin from "../components/auth/signin";
import SignInWithProvider from "../components/auth/signin";
import NavBar from "../components/navbar";
import {isCreator} from "../lib/logic/requests/frontend"

export default function AccountPage({ providers }: any) {
  const { data: session } = useSession();
  const [creator, setCreator] = useState(false);

   useEffect(() => {
    isCreator(  session?.user?.email || "" ).then( (res: any) => {
      console.log("res", res);
      setCreator(res)
   })
  }, [session])

  if (session) {
    return (
      <>
        <NavBar />
        <div className="w-screen h-full flex flex-col justify-center items-center">
          Signed in as {session.user?.email} <br />
          {creator ? "Creator" : "Not Creator"}
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
     <MagicEmailSignin email="halvorviv@gmail.com"/>
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