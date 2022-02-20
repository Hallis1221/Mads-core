import { useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import MagicEmailSignin from "../../../../components/auth/signin";
import TopAuth from "../../../../components/auth/topbar";
import SideBar from "../../../../components/dashboard/sidebar";
import DashboardTopRow from "../../../../components/dashboard/toprow";

// The users page displays a list of users and their roles.
export default function UsersAdminPage({}) {
  // Get session
  const { data: session } = useSession();

  const [users, setUsers] = useState([]);

  if (!session?.user)
    return (
      <div className="w-screen flex flex-col justify-center items-center">
        Not signed in <br />
        <MagicEmailSignin />
      </div>
    );
  return (
    <>
      <Head>
        <title>Mads Content Account Page</title>
      </Head>
      <main>
        <div className="relative h-screen w-full bg-[#F2F7FF] flex flex-row font-mulish overflow-hidden">
          <SideBar
            items={[
              {
                id: 1,
                title: "Overview",
                link: "/admin/dashboard",
                icon: "briefcase",
              },
              {
                id: 2,
                // Later one this will be a page of all submissions and not just the submit page
                title: "Users",
                link: "/admin/dashboard/users",
                icon: "users",
              },
              {
                id: 3,
                title: "Account",
                link: "/creator/dashboard/account",
                icon: "user",
              },
              {
                id: 4,
                title: "Payments",
                link: "/creator/dashboard/payments",
                icon: "star",
              },
            ]}
          />
          <div className="px-16 ">
            <div>
              <table className="table-auto w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Creator</th>
                    <th className="px-4 py-2">Admin</th>
               
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: any) => (
                    <tr key={user._id}>
                      <td className="border px-4 py-2">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="border px-4 py-2">
                        {user.amount.toFixed(2)}$
                      </td>
                      <td className="border px-4 py-2">{user.status}</td>
            
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
