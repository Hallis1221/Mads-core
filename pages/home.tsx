import CornerLogo from "../components/logo";
import Image from "next/image";
import Link from "next/link";

export default function NewHome({}) {
  return (
    <main className="w-screen h-screen bg-hero-image bg-cover  ">
      <div className="from-white bg-gradient-to-r via-white h-screen w-11/12">
        <div className="pl-64 font-poppins font-inter pt-16">
          <div className="pt-16">
            <Image
              src="/mads.svg"
              alt="Vercel Logo"
              width={300 * 0.5}
              height={128 * 0.5}
            />
          </div>
          <div className="pt-16 text-9xl font-extrabold">
            It´s time to ditch
            <br />
            AdFly and Linkvertise
          </div>
          <div className="pt-16 text-5xl font-semibold w-3/6">
            MarketAds is the brand new family-friendly way to help you monetize
            your Minecraft content. Coming 2022!
          </div>
          <div className="flex flex-1 flex-row items-center pt-20 text-xl">
            <button className="text-white px-4 h-20 w-64  rounded-3xl font-semibold bg-blue-600 hover:bg-blue-700">
              <Link href="/waitlist/creator">Join waitlist</Link>
            </button>
            <div className="font-bold pl-24"><Link href="/about" passHref={false}>
            Learn more →
            </Link></div>
          </div>
        </div>
      </div>
    </main>
  );
}
