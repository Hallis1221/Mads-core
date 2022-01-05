import type { NextPage } from "next";
import { Parallax, ParallaxProvider } from "react-scroll-parallax";

const Home: NextPage = () => {
  return (
    <>

    <ParallaxProvider>

      <div className="m-0 p-0 w-full h-full bg-top bg-white">
        <Parallax y={["1000%", "200%"]} tagOuter={"image"}>
          <div className="w-full h-screen absolute bg-hero-image bg-center"></div>
        </Parallax>
        <div className="absolute w-full h-screen text-center justify-center font-extrabold text-3xl lg:text-5xl xl:text-5xl">
          <Parallax y={["0px", "290px"]} x={["0%", "-1%"]} tagOuter={"text"} >
            Minecraft monetization,
          </Parallax>
        </div>
         <div className="absolute w-full h-screen text-center top-0 font-extrabold text-7xl lg:text-9xl xl:text-9xl mix-blend-overlay">
          <Parallax y={["1000px", "325px"]} tagOuter={"text"}>
            Redefined.
          </Parallax>
        </div>
        <div className="absolute w-full h-screen text-center top-0 font-extrabold text-7xl lg:text-9xl xl:text-9xl mix-blend-overlay">
          <Parallax y={["1000px", "325px"]} tagOuter={"text"}>
            Redefined.
          </Parallax>
        </div>
        <div className="absolute w-full h-screen text-center top-0 font-extrabold text-4xl mix-blend-normal">
          <Parallax y={["1000%", "2000%"]} x={["0%", "-1%"]} tagOuter={"text"}>
          Coming 2022.
          </Parallax>
      
        </div>
     
      </div>
    </ParallaxProvider>
    </>
  );
};

export default Home;
