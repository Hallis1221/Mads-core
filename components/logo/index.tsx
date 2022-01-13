import Image from "next/image";
import Link from "next/link";

export default function CornerLogo() {
  return (
    <Link href="/" passHref={true}>
      <div className="pl-2 hover:cursor-pointer z-10">
        <Image src="/mads.svg" alt="Vercel Logo" height={128/1.5} width={128} />
      </div>
    </Link>
  );
}
