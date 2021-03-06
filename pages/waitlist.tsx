import Head from "next/head";
import Link from "next/link";
import { NextPage } from "next/types";
import NavBar from "../components/navigation/navbar";

const Waitlist: NextPage = () => {
  // https://getwaitlist.com
  return (
    <>
    <Head>
      <title>Mads waitlists</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
   <NavBar>{}</NavBar>
      <div className="w-screen h-full flex flex-col justify-center items-center">
        <Link href="/waitlist/creator">Creator Waitlist </Link>
      </div>
    </>
  );
};

export default Waitlist;
