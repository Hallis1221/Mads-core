import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export default function TopAuth() {
  const { data: session } = useSession();
  if (session?.user)
    return (
      <div className="flex flex-1 flex-row sm:items-center justify-end pr-2 pt-2 w-auto">
        <div className="hidden sm:inline-block">{session.user.email} </div>
        <div className="sm:pl-5">
          <Link href="/account" passHref>
            <Image
              src={session.user.image || ""}
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
    <div className="flex relative flex-wrap-reverse justify-end  px-4 md:px-8 lg:px-16 xl:px-8 py-8 z-20  bg-transparent">
      <div className="relative bg-transparent h-20 w-40 text-center flex flex-col justify-center">
        <Link href="/account" passHref={true}>
          Sign in
        </Link>
      </div>
    </div>
  );
}
