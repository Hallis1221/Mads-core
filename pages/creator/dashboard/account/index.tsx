import { useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import SideBar from "../../../../components/dashboard/sidebar";
import { createApiKey } from "../../../../lib/api/requests/frontend";

export default function Page({}) {
  // Use session to get user data
  const { data: session } = useSession();
  let [generatedKey, setGeneratedKey] = useState("");

  return (
    <>
      <Head>
        <title>Mads Content Account Page</title>
      </Head>
      <main>
        <div className="relative h-screen w-full bg-[#F2F7FF] flex flex-row font-mulish overflow-hidden">
          <SideBar />
          <div className="px-16 ">
            <div className="text-3xl  font-bold pt-5 tracking-no">
              Hello, {session?.user?.email}
            </div>
            <div>
              <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={async () => {
                  setGeneratedKey(await createApiKey());
                }}
              >
                Create API Key
              </button>
             {
               generatedKey === "" ? "" : <div>
                  <div className="text-xl font-bold">Your new API Key is {generatedKey}. </div>
                  <div className="text-xl font-bold text-yellow-700">
                    You can not reset this key, so please store it somewhere safe.
                  </div>
               </div>
             }
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
