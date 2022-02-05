import { Formik } from "formik";
import {
  signIn,
} from "next-auth/react";
import toast from "react-hot-toast";
import * as Yup from "yup";

export default function MagicEmailSignin() {

  const EmailSchema = Yup.object().shape({
    email: Yup.string()
      .required("This field is mandatory")
      .email("Enter a valid email"),
  });
  return (
    <Formik
      initialValues={{ email: "", hasSubmitted: false }}
      validationSchema={EmailSchema}
      onSubmit={async (values) => {
        toast.loading("Working...");
        await signIn("email", { email: values.email, redirect: false , });
        values.hasSubmitted = true;
        toast.dismiss();
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
        if (values.hasSubmitted) return <div>Email sent. Please check your inbox and click the link we sent you to login </div>;
        return (
          <form className="bg-white rounded" onSubmit={handleSubmit}>
            <div className="mb-4">
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
            <div className="flex justify-center ">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline left-0"
                onClick={() => {
                  handleSubmit();
                }}
                type="submit"
                disabled={isSubmitting}
              >
                Login
              </button>
            </div>
          </form>
        );
      }}
    </Formik>
  );
}

/* 
   <button onClick={() => signIn("email", { email: "halvorviv@gmail.com" })}>
      Sign in with email.
    </button>
*/
