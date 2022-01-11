import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import MD5 from "crypto-js/md5";

export default function TopAuth() {
  const { data: session } = useSession();
  if (session?.user)
    return (
      <div className="flex flex-1 flex-row sm:items-center justify-end pr-2 pt-2 w-auto">
        <div className="hidden sm:inline-block">{session.user.email} </div>
        <div className="sm:pl-5">
          <Link href="/account" passHref>
            <Image
              src={session.user?.image || `https://www.gravatar.com/avatar/${MD5(session.user?.email).toString()}`}
              alt="User profile picture"
              height={60}
              width={60}
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
