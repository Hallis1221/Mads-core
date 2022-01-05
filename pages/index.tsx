import type { NextPage } from "next";
import { Parallax, ParallaxProvider } from "react-scroll-parallax";

const Home: NextPage = () => {
  return (
    <>


      <div className="m-0 p-0 w-full h-full bg-top bg-white">
    
          <div className="w-full h-screen absolute bg-hero-image bg-center"></div>

        <div className="absolute w-full top-[40%]  text-center font-extrabold text-9xl mix-blend-overlay">
  
          Coming 2022.

        </div>
        
        <div className="absolute w-full top-[40%]  text-center font-extrabold text-9xl mix-blend-overlay">
  
          Coming 2022.

        </div>
     
      </div>

    </>
  );
};

export default Home;
