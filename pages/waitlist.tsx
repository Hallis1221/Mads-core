import Link from "next/link";
import { NextPage } from "next/types";
import CornerLogo from "../components/logo";

const Waitlist: NextPage = () => {
  // https://getwaitlist.com
  return (
    <>
      <CornerLogo />
      <div className="w-screen h-screen flex flex-col justify-center items-center">
        <Link href="/waitlist/creator">Creator Waitlist </Link>
      </div>
    </>
  );
};

export default Waitlist;
