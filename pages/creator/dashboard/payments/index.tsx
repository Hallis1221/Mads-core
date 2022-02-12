import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import SideBar from "../../../../components/dashboard/sidebar";
import {
  createApiKey,
  getStripeID,
  getStripeOnboardingLink,
  isCreator,
} from "../../../../lib/api/requests/frontend";

export default function PaymentsPage({}) {
  // Use session to get user data
  const { data: session } = useSession();
  const [stripeID, setStripeID] = useState("");
  const [onboardingURL, setOnboardingURL] = useState("");

  useEffect(() => {
    getStripeID().then((res: any) => {
      if (res) {
        setStripeID(res);
        getStripeOnboardingLink().then((res: any) => {
          if (res) setOnboardingURL(res);
        });
      }

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

  
            {onboardingURL === "" ? (
              ""
            ) : (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-5 py-2  px-4 rounded"
                onClick={async () => {
                  window.location.href = onboardingURL;
                }}
              >
               Setup
              </button>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
