import { Parallax, Background } from "react-parallax";
import Image from "next/image";

export default function AboutPage({}) {
  return (
    <div className="h-1/2">
      <Parallax
        renderLayer={(percentage) => (
          <>
            <div className="bg-black h-screen flex flex-col justify-center font-poppins">
              <div className="text-center font-bold text-9xl text-white">
                Mads.
              </div>
              <div className="text-center font-medium text-4xl text-white">
                The safe way to monetize your content.
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                left: "50%",
                width: percentage * 640,
                height: percentage * 675,
              }}
            >
              <Image
                src="https://www.5framestudios.com/uploads/1/3/1/3/131356359/published/fiverrgreekrender-1.png?1631557451"
                layout="fill"
                alt="Background image"
                className="object-center object-cover pointer-events-none -z-10 blur-sm overflow-hidden"
                priority={true}
              />
              <div className="h-screen flex flex-col justify-center text-white font-extrabold text-8xl text-center mix-blend-overlay">
                {percentage >= 1.25 ? "Advertiser" : ""}
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                right: "50%",
                width: percentage * 640,
                height: percentage * 675,
              }}
            >
              <Image
                src="https://pixelpoly.co/assets/img/portfolio/ctf.png"
                layout="fill"
                alt="Background image"
                className="object-center h-screen pointer-events-none object-cover blur-sm hover:blur-none overflow-hidden"
                priority={true}
              />
              <div className="h-screen flex flex-col justify-center text-white font-extrabold text-8xl z-1 text-center mix-blend-overlay">
                {percentage >= 1.25 ? "Creator" : ""}
              </div>
            </div>
            <div className="h-screen " />
          </>
        )}
      ></Parallax>
    </div>
  );
}
