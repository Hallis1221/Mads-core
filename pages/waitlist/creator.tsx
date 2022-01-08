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

// Waitlist page that has a form where users can enter their email address
const CreatorWaitlist: NextPage = () => {
  const [data, setData] = React.useState<any>(null);

  const EmailSchema = Yup.object().shape({
    email: Yup.string()
      .required("This field is mandatory")
      .email("Enter a valid email"),
  });
  // Inspired by the tailwind docs :D
  return (
    <>
   <NavBar />
      <div className="w-screen h-full flex flex-col justify-center items-center">
        <Formik
          initialValues={{ email: "", action: "register" }}
          validationSchema={EmailSchema}
          onSubmit={async (values) => {
            toast.loading("Working...")
            if (values.action === "register")
              await registerForCreatorWaitlist(values.email, document.URL).then(
                (res) => {
                  setData(res);
                }
              );
            else if (values.action === "check")
              await checkUserInfo(values.email).then((res) => {
                setData(res);
              });
          toast.dismiss()
            }}
          
        >
          {(props) => {
            const {
              values,
              touched,
              errors,
              dirty,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit,
              handleReset,
            } = props;
            return (
              <div className="w-12/12 h-2/12 lg:w-1/6 xl:w-1/6">
                <form
                  className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                  onSubmit={handleSubmit}
                >
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full h-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="email"
                      placeholder="Enter your email"
                      type="text"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>

                  {errors.email && touched.email && (
                    <div className="input-feedback mb-5">{errors.email}</div>
                  )}
                  <div className="flex justify-between ">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline left-0"
                      onClick={() => {
                        values.action = "register";
                        handleSubmit();
                      }}
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Waitlist me!
                    </button>
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline "
                      onClick={() => {
                        values.action = "check";
                        handleSubmit();
                      }}
                      type="button"
                    >
                      Check Status
                    </button>
                  </div>
                </form>
              </div>
            );
          }}
        </Formik>
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
