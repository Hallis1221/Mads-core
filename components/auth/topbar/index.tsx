import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {md5} from 'pure-md5';
import toast from "react-hot-toast";

export default function TopAuth() {
  const { data: session } = useSession();
  if (session && session.user?.email)
    return (
      <div className="flex flex-1 flex-row sm:items-center justify-end pr-2 pt-2 w-auto z-10">
        <div className="hidden sm:inline-block">{session.user.email} </div>
        <div className="sm:pl-5">
          <Link href="/account" passHref>
            <Image
              src={session.user?.image || `https://www.gravatar.com/avatar/${md5(session.user.email).toString()}`}
              alt="User profile picture"
              height={60}
              width={60}
              onClick={(e) => toast.dismiss()}
              className="rounded-full hover:cursor-pointer"
            />
          </Link>
        </div>
      </div>
    );

  return (
    <div className="flex flex-1 flex-row sm:items-center justify-end pr-5 pt-2 w-auto">
      <div className="mt-auto">
        <Link href="/account" passHref={true}>
          Sign in
        </Link>
      </div>
    </div>
  );
}
