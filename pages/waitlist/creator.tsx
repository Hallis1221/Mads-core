import { NextPage } from "next/types";
import CornerLogo from "../../components/logo";
import React from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  checkUserInfo,
  registerForCreatorWaitlist,
} from "../../lib/logic/requests/frontend";
import toast from "react-hot-toast";
import NavBar from "../../components/navbar";
import { useSession } from "next-auth/react";
import Link from "next/link";

// Waitlist page that has a form where users can enter their email address
const CreatorWaitlist: NextPage = () => {
  const [data, setData] = React.useState<any>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { data: session } = useSession();

  // Inspired by the tailwind docs :D

  return (
    <>
      <NavBar />
      <div className="w-screen h-full flex flex-col justify-center items-center pt-24">
        <div className="flex justify-between ">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline left-0"
            onClick={async () => {
              setIsSubmitting(true);
              if (session && session.user?.email) {
                toast.loading("Checking your email...");
                let res = await registerForCreatorWaitlist(
                  session.user?.email,
                  document.URL
                );
                setData(res);

                setIsSubmitting(false);
                toast.dismiss();
                toast.success("Successfully registered/checked!");
              } else
                toast.custom((t) => (
                  <div
                    className={`${
                      t.visible ? "animate-enter" : "animate-leave"
                    } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                  >
                    <div className="flex-1 w-0 p-4">
                      <div className="flex items-start">
                        <div className="ml-3 flex-1">
                
                          <p className="mt-1 text-sm text-gray-500">
                            You need to be signed in with a valid email to register for the waitlist.
                          </p>
                        </div>
                      </div>
                    </div>
                    <Link href="/account" passHref>
                    <div className="flex border-l border-gray-200">
                      <button
                        onClick={() => toast.dismiss()}
                        className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        Register
                      </button>
                    </div>
                    </Link>
                  </div>
                ));
                setIsSubmitting(false);
            }}
            type="submit"
            disabled={isSubmitting}
          >
            Waitlist me!
          </button>
        </div>

        {data !== null && (
          <div className="text-center">
            Refferal link (Jump up a spot for each refferal!):{" "}
            <button
              className="bg-[#fafafa] rounded-md p-3 "
              onClick={() => {
                navigator.clipboard.writeText(data.referral_link);
                toast.success("Copied to clipboard!");
              }}
            >
              {data.referral_link}
            </button>
            You have {data.total_referrals} refferal(s)
            <br />
            Spot: {data.current_priority} of {data.total_users}
          </div>
        )}
      </div>
    </>
  );
};

export default CreatorWaitlist;
