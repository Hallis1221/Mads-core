import { useSession } from "next-auth/react";
import Head from "next/head";
import MagicEmailSignin from "../../../components/auth/signin";
import SideBar from "../../../components/dashboard/sidebar";

export default function AdminDahboard({}) {
  // Get session
  const { data: session } = useSession();

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
        <title>Admin Dashboard</title>
      </Head>
      <div className="relative h-screen w-full bg-[#F2F7FF] overflow-hidden flex flex-row font-mulish">
        <SideBar
          items={[
            {
              id: 1,
              title: "Overview",
              link: "/creator/dashboard",
              icon: "briefcase",
            },
            {
              id: 2,
              // Later one this will be a page of all submissions and not just the submit page
              title: "Users",
              link: "/creator/dashboard/submit",
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
      </div>
    </>
  );
}
