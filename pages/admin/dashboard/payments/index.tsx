import toast from "react-hot-toast";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import SideBar from "../../../../components/dashboard/sidebar";
import { Payment } from "../../../../lib/types/data/payment";
import { adminSideItems } from "..";
import { getPendingPayments } from "../../../../lib/api/requests/frontend";

export default function PaymentsPage({}) {
  // Use session to get user data
  const { data: session } = useSession();
  const [pendingPayments, setPendingPayments] = useState([]);

  // Get pending payments
  useEffect(() => {
    if (!session) return;
    getPendingPayments().then((res) => {
      setPendingPayments(res);
    });
  }, [session]);
  return (
    <>
      <Head>
        <title>Mads Content Account Page</title>
      </Head>
      <main>
        <div className="relative h-screen w-full bg-[#F2F7FF] flex flex-row font-mulish overflow-scroll">
          <SideBar items={adminSideItems} />
          <div className="px-16 ">
            <div>
              <table className="table-auto w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Amount</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">User email</th>
                    <th className="px-4 py-2">User ID</th>
                    <th className="px-4 py-2">Stripe ID</th>
                    <th className="px-4 py-2">Total views</th>
                    <th className="px-4 py-2">Total clicks</th>
                    <th className="px-4 py-2">Accept</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingPayments.map((payment: Payment) => (
                    <tr key={Math.random() * 1000}>
                      <td className="border px-4 py-2">{payment.date}</td>
                      <td className="border px-4 py-2">{payment.amount}</td>
                      <td className="border px-4 py-2">{payment.status}</td>
                      <td className="border px-4 py-2">{payment.type}</td>
                      <td className="border px-4 py-2">{payment.email}</td>
                      <td className="border px-4 py-2">{payment.userID}</td>
                      <td className="border px-4 py-2">{payment.stripeID}</td>
                      <td className="border px-4 py-2">{payment.totalViews}</td>
                      <td className="border px-4 py-2">
                        {payment.totalClicks}
                      </td>
                      <td className="border px-4 py-2">
                        <button
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                          onClick={() => {
                            console.log("Accept payment");
                            toast.success("Payment accepted (not really)");
                          }}
                        >
                          Accept
                        </button>
                      </td>
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
