import Link from "next/link";
import { NextPage } from "next/types";
import CornerLogo from "../../components/logo";
import NavBar from "../../components/navbar";

const Waitlist: NextPage = () => {
  // https://getwaitlist.com
  return (
    <>
   <NavBar />
      <div className="w-screen h-full flex flex-col justify-center items-center">
        <Link href="/waitlist/creator">Creator Waitlist </Link>
      </div>
    </>
  );
};

export default Waitlist;
