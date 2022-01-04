import Image from "next/image";
import Link from "next/link";

export default function CornerLogo() {
  return (
    <Link href="/" passHref={true}>
      <div className="items-end justify-start flex px-4 md:px-8 lg:px-16 xl:px-8 py-8 absolute z-20 hover:cursor-pointer">
        <Image
          src="/mads.svg"
          alt="Vercel Logo"
          width={300 * 0.3}
          height={128 * 0.3}
        />
      </div>
    </Link>
  );
}
