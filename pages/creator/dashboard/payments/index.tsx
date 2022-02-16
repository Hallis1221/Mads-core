import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import SideBar from "../../../../components/dashboard/sidebar";
import {
  createNewPaymentRequest,
  getAvalibleCreatorPayout,
  getPaymentHistory,
  getStripeID,
  getStripeOnboardingLink,
} from "../../../../lib/api/requests/frontend";
import ReactLoading from "react-loading";
import toast from "react-hot-toast";

export default function PaymentsPage({}) {
  // Use session to get user data
  const { data: session } = useSession();
  const [stripeID, setStripeID] = useState("");
  const [onboardingURL, setOnboardingURL] = useState("");
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [avaliableTakout, setAvaliableTakout] = useState(0);
  const [minPayout, setMinPayout] = useState(0);

  useEffect(() => {
    getStripeID()
      .then((res: any) => {
        toast.success("Stripe id fetched!");
        if (res) {
          setStripeID(res);
          getStripeOnboardingLink()
            .then((res: any) => {
              toast.success("Onboarding url fetched!");
              if (res) setOnboardingURL(res);
            })
            .catch((err: any) => {
              toast.error(err.message);
            });
        }
      })
      .catch((err: any) => {
        toast.error(err.message);
      });

    getPaymentHistory().then((res: any) => {
      toast.success("Payment history fetched!");
      if (res) setPaymentHistory(res);
    });

    toast.loading("Fetching excat payout amount... This could take up to 30 seconds.");
    getAvalibleCreatorPayout().then((res: any) => {
      toast.dismiss();
      toast.success("Avaliable payout fetched!");
      if (res.balance < 0) res.balance = 0;
      setAvaliableTakout(res.balance.toFixed(2));
      setMinPayout(res.minimumPayout.toFixed(2));
    });
  }, [session]);
  let eligible = true;

  if (!stripeID) eligible = false;
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
              <ReactLoading type="spinningBubbles" color="#000" />
            ) : (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-5 py-2  px-4 rounded"
                onClick={async () => {
                  window.location.href = onboardingURL;
                }}
              >
                Setup / Change stripe payout account details.
              </button>
            )}
            {eligible ? (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-5 py-2 mx-5 px-4 rounded"
                onClick={async () => {
                  toast.loading("Processing payment...", {});
                  createNewPaymentRequest()
                    .then((res: any) => {
                      toast.dismiss();
                      if (res) {
                        toast.success("Payment request created successfully.");
                      } else {
                        toast.error("Payment request failed.");
                      }
                    })
                    .catch((err: any) => {
                      toast.dismiss();
                      toast.error(
                        err.message.split(
                          ` {"response":{"errors":[{"message":"`
                        )[0]
                      );
                    });
                }}
              >
                Create new payout
              </button>
            ) : (
              ""
            )}
            <br />
            Your stripe payout account id is.
            <button
              className="bg-[#fafafa] rounded-md p-3 "
              onClick={() => {
                navigator.clipboard.writeText(stripeID);
                toast.success("Copied to clipboard!");
              }}
            >
              {stripeID}
            </button>
            <br /> Our support team may ask for this if issues arise while
            processing your payout.
            <div>
              <br />
              Avaliable for payout: {avaliableTakout}$. Minimum payout is{" "}
              {minPayout}$. You are {eligible ? "" : "not"} eligible for payout.
              <table className="table-auto w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Amount</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((payment: any) => (
                    <tr key={payment.id}>
                      <td className="border px-4 py-2">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </td>
                      <td className="border px-4 py-2">
                        {payment.amount.toFixed(2)}$
                      </td>
                      <td className="border px-4 py-2">{payment.status}</td>
                      <td className="border px-4 py-2">{payment.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
