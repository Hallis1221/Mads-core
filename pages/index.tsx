import Image from "next/image";
import Link from "next/link";

export default function NewHome({}) {
  return (
    <main className="bg-cover bg-center bg-no-repeat w-screen h-screen bg-hero-image   ">
      <div className="w-12/12 via-white lg:w-full 2xl:w-11/12 lg:via-white 2xl:via-white from-white bg-gradient-to-r h-screen ">
        <div className="pl-8 sm:pl-16 2xl:pl-64 pt-16 font-poppins font-inter">
          <div className="pt-0 2xl:pt-16">
           
            <Image
              src="/mads.svg"
              alt="Vercel Logo"
              width={300 * 0.5}
              height={128 * 0.5}
              priority={true}
            />
          
          </div>
          <div className="pt-8 sm:pt-16 text-3xl sm:text-5xl lg:text-7xl xl:text-8xl 2xl:text-8xl font-extrabold">
            It´s time to ditch
            <br />
            AdFly and Linkvertise
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl pt-4 sm:pt-16 2xl:pt-24 w-11/12 lg:w-5/6 xl:w-4/6 2xl:w-6/12 font-semibold">
            MarketAds is the brand new family-friendly way to help you monetize
            your Minecraft content. Coming 2022!
          </div>
          <div className="text-lg sm:text-xl 2xl:text-xl flex flex-1 flex-row items-center pt-10 sm:pt-20 ">
            <button className="text-white px-4 sm:px-4 h-12 sm:h-20 w-46 sm:w-64  rounded-3xl font-semibold bg-blue-600 hover:bg-blue-700">
              <Link href="/waitlist/creator">Join waitlist</Link>
            </button>
            <div className="pl-6 sm:pl-12 2xl:pl-24 font-bold"><Link href="/about" passHref={false}>
            Learn more →
            </Link></div>
          </div>
        </div>
      </div>
    </main>
  );
}
