import Image from "next/image";
import Link from "next/link";

export default function CornerLogo() {
  return (
    <Link href="/" passHref={true}>
      <div className="px-4 md:px-8 lg:px-16 xl:px-8 py-8 z-20 bg-transparent w-64 hover:cursor-pointer">
        <Image
          src="/mads.svg"
          alt="Vercel Logo"
          width={300 * 0.5}
          height={128 * 0.5}
        />
      </div>
    </Link>
  );
}
