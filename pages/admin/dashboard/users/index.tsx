import { useSession } from "next-auth/react";
import Head from "next/head";
import { md5 } from "pure-md5";
import Image from "next/image";
import { useEffect, useState } from "react";
import MagicEmailSignin from "../../../../components/auth/signin";
import SideBar from "../../../../components/dashboard/sidebar";
import { getAllUsers, setCreator } from "../../../../lib/api/requests/frontend";
import DashboardTopRow from "../../../../components/dashboard/toprow";
import toast from "react-hot-toast";

// The users page displays a list of users and their roles.
export default function UsersAdminPage({}) {
  // Get session
  const { data: session } = useSession();

  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (session?.user)
      getAllUsers().then((res) => {
        console.log(res);
        setUsers(res);
      });
  }, [session]);

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
        <div className="relative h-screen w-full bg-[#F2F7FF] flex flex-row font-mulish ">
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
          <div className="w-full px-5">
            {" "}
            <DashboardTopRow title="Admin overview" />
            <div className="left-5 w-fit h-5/6 overflow-scroll">
              <table className="table-auto ">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Image</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Creator</th>
                    <th className="px-4 py-2">Switch creator status</th>
                    <th className="px-4 py-2">Admin</th>
                    <th className="px-4 py-2">StripeID</th>
                    <th className="px-4 py-2">ID</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: any) => (
                    <tr key={user.id}>
                      <td className="border px-4 py-2">
                        {" "}
                        <Image
                          priority
                          src={
                            user.image ||
                            `https://www.gravatar.com/avatar/${md5(
                              user.email
                            )}?s=200`
                          }
                          width={50}
                          height={50}
                          alt={`${user.email} profile picture `}
                        />
                      </td>
                      <td className="border px-4 py-2">{user.email}</td>
                      <td className="border px-4 py-2">
                        {user.creator ? "Yes" : "No"}
                      </td>
                      <td className="border px-4 py-2">
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                          onClick={() => {
                            setCreator(user.email, !user.creator).then(() => {
                              toast.success(
                                `${user.email} is now ${
                                  user.creator ? "not" : ""
                                } a creator`
                              );

                              // Update the users list
                              getAllUsers().then((res) => {
                                setUsers(res);
                              });
                             
                            });
                          }}
                        >
                          {user.creator ? "Remove creator" : "Make creator"}
                        </button>
                      </td>

                      <td className="border px-4 py-2">
                        {user.admin ? "Yes" : "No"}
                      </td>
                      <td className="border px-4 py-2">
                        {user.stripeID ? user.stripeID : "none"}
                      </td>
                      <td className="border px-4 py-2">{user.id}</td>
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
