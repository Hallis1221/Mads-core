import { useSession, signIn,  } from "next-auth/react"
import Link from "next/link";
import Image from "next/image";


export default function TopAuth() {
const { data: session } = useSession()
    if (session)
  return (
    <div className="flex relative flex-wrap-reverse justify-end  px-4 md:px-8 lg:px-16 xl:px-8 py-8 z-20  bg-transparent">
      <div className="relative bg-transparent h-20 w-40 text-center flex flex-col justify-center p-5 mr-5">
      <div className="relative"> {session.user?.email} </div>

      </div>
      <Link href="/account" passHref={true}>
      <Image src={session.user?.image || ""}  alt="User profile picture"  height={80} width={80} className="rounded-full hover:cursor-pointer"/>
      </Link>

    </div>
  );
  return (
    <div className="flex relative flex-wrap-reverse justify-end  px-4 md:px-8 lg:px-16 xl:px-8 py-8 z-20  bg-transparent">
      <div className="relative bg-transparent h-20 w-40 text-center flex flex-col justify-center">
      <Link href="/account" passHref={true}> Sign in </Link>
      </div>
    </div>);
}
