import { useSession } from "next-auth/react";
import Head from "next/head";
import SideBar from "../../../../components/dashboard/sidebar";
import { createUserContent } from "../../../../lib/logic/requests/frontend";

export default function SubmissionPage({}) {
  // Get authentication session
  const {data: session}= useSession();

  if (!session?.user) return <div>Not signed in</div>;
 //  console.log(createUserContent("test", "test", ["tags"]));
  return (
    <>
    <Head>
      <title>
        Mads Content Submission Page
      </title>
    </Head>
    <main>
      <div className="relative h-screen w-full bg-[#F2F7FF] flex flex-row font-mulish">
        <SideBar />
        <div className="px-16 ">
          <div className="text-3xl  font-bold pt-5 tracking-no">
            Submission Page
          </div>
          
        </div>
      </div>
    </main>
    </>
  );
}
