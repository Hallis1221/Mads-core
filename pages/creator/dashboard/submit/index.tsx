import { useSession } from "next-auth/react";
import Head from "next/head";
import SideBar from "../../../../components/dashboard/sidebar";
import Link from "next/link";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { createUserContent } from "../../../../lib/api/requests/frontend";

export default function SubmissionPage({}) {
  // Get authentication session
  const { data: session } = useSession();

  if (!session?.user) return <div>Not signed in</div>;
  return (
    <>
      <Head>
        <title>Mads Content Submission Page</title>
      </Head>
      <main>
        <div className="absolute h-screen w-full bg-[#F2F7FF] overflow-hidden flex flex-row font-mulish">
          <SideBar />
          <div className="px-0 xl:px-16 ">
            <div className="text-3xl w-96 right-10 font-bold pt-5 xl:pl-0 pl-16 tracking-no">
              Submission Page
            </div>

            <ContentSubmissionForm />
          </div>
        </div>
      </main>
    </>
  );
}

function ContentSubmissionForm({}): React.ReactElement {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contentID, setContentID] = useState("");
  const [created, setCreated] = useState(false);

  if (created)
    return (
      <div className="pt-10">
        Created.
        <Link
          href="/creator/dashboard/content/[id]"
          as={`/creator/dashboard/content/${contentID}`}
        >
          <a className="text-blue-500 hover:text-blue-700 pl-5">View content</a>
        </Link>
      </div>
    );

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required").max(50, "Title too long"),
    link: Yup.string()
      .url("Link is not valid a valid URL")
      .required("Link is required"),
    tags: Yup.string().required("Tags are required"),
  });

  const initialValues = {
    title: "",
    link: "",
    tags: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        setIsSubmitting(true);
        let tags = values.tags.split(",");
        createUserContent({
          title: values.title,
          link: values.link,
          tags: tags,
        })
          .then((val) => {
            setContentID(val.contentID);
            setCreated(true);
            setIsSubmitting(false);
            toast.success("Content submitted successfully");
          })
          .catch((err) => {
            console.error(err);
            toast.error(
              err.message
                .split(`{"response":`)[0]
                .replace(/\n/g, "")
                .replace(":", ""),
              {
                duration: 5000,
              }
            );
            setIsSubmitting(false);
          });
      }}
    >
      {({}) => (
        <Form className="w-10/12 xl:w-fit pl-10">
          <div className="text-xl pt-16  font-bold tracking-no">Title</div>
          <Field
            className="w-full h-12 p-2 border-2 border-gray-400 rounded-lg"
            type="text"
            name="title"
            placeholder="Title"
          />
          <ErrorMessage name="title" component="div" />
          <div className="text-xl  font-bold tracking-no">Link</div>
          <Field
            className="w-full h-12 p-2 border-2 border-gray-400 rounded-lg"
            type="text"
            name="link"
            placeholder="Link"
          />
          <ErrorMessage name="link" component="div" />
          <div className="text-xl  font-bold tracking-no  ">Tags
          <div className="font-normal"> Seperate each tag with a comma.<br/> For example tag1,tag2,tag3</div>
          </div>
          <div className="flex flex-row">
            <div className="flex flex-col">
              <Field
                className="w-full h-12 p-2 border-2 border-gray-400 rounded-lg"
                type="text"
                name="tags"
                placeholder="Tags"
              />
              <ErrorMessage name="tags" component="div" />
            </div>

            <div className="w-full h-12 p-2 border-2 border-gray-400 rounded-lg">
              <button
                className="w-full h-12 p-2 border-2 border-gray-400 rounded-lg"
                type="submit"
                disabled={isSubmitting}
              >
                Submit
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
