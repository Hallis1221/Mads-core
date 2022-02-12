import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import SideBar from "../../../../components/dashboard/sidebar";
import { createApiKey, getStripeID, isCreator } from "../../../../lib/api/requests/frontend";

export default function PaymentsPage({}) {
// Use session to get user data
const { data: session } = useSession();
const [key, setKey] = useState("");

useEffect(() => {
  getStripeID().then((res: any) => {
    console.log(res);
    setKey(res.stripeID);
  });

}, [session]);

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
          <div className="w-screen h-full flex flex-col justify-center items-center mt-64">
          {key}
         
        </div>
        </div>
      </div>
    </main>
  </>
);
}
