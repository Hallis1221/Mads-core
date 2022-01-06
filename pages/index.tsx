import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>




      <div className="w-screen h-screen relative justify-center">
        <Image
          layout="fill"
          objectFit="cover"
          className="blur-sm"
          quality={100}
          src={"https://pixelpoly.co/assets/img/portfolio/ctf.png"}
          alt={"x.bannerImage.alternativeText"}
        />



<div className="z-10 absolute left-0 right-0 ml-auto mr-auto w-24 top-2/3 ">
<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-32">
  <Link href="/waitlist">
    Join waitlist
  </Link>
</button>
</div>
        <div className="absolute text-center justify-center pb-24 flex flex-1 flex-col w-screen text-8xl lg:text-9xl xl:text-9xl h-screen font-extrabold mix-blend-overlay">

          Coming 2022.

        </div>
        <div className="absolute text-center justify-center pb-24 flex flex-1 flex-col w-screen text-8xl lg:text-9xl xl:text-9xl h-screen font-extrabold mix-blend-overlay">

          Coming 2022.

        </div>

       
      </div>

    </>
  );
};

export default Home;
