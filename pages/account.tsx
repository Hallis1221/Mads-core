import { useSession, signOut } from "next-auth/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import MagicEmailSignin from "../components/auth/signin";
import NavBar from "../components/navigation/navbar";
import { isCreator } from "../lib/api/requests/frontend";

export default function AccountPage({}: any) : React.ReactElement {
  const { data: session } = useSession();
  const [creator, setCreator] = useState(false);

  useEffect(() => {
    isCreator(session?.user?.email || "").then((res: any) => {
      setCreator(res);
    });
  }, [session]);

  if (session) {
    return (
      <>
        <Head>
          <title>Mads Account</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <NavBar>{}</NavBar>
        <div className="w-screen h-full flex flex-col justify-center items-center mt-64">
          Signed in as {session.user?.email} <br />
          {creator ? "Creator" : "Not Creator"}
          <button onClick={() => signOut()}>Sign out</button>
        </div>
      </>
    );
  }
  return (
    <>
      <Head>
        <title>Mads Account</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar >{}</NavBar>
      <div className="w-screen flex flex-col justify-center items-center pt-24">
        Not signed in <br />
        <MagicEmailSignin />
      </div>
    </>
  );
}
