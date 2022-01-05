import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>


      <div className="relative">
    
          <div className="relative h-[210vh] w-[210vw] md:h-screen md:w-screen lg:h-screen lg:w-screen bg-hero-image bg-cover bg-no-repeat overflow-auto">
          </div>

        <div className="absolute w-screen top-[40%] left-[40%] md:left-0 lg:lef-0 xl:left-0  text-center font-extrabold text-9xl mix-blend-overlay">
  
          Coming 2022.

        </div>
        
        <div className="absolute w-full top-[40%] left-[40%]  md:left-0 lg:lef-0 xl:left-0 text-center font-extrabold text-9xl mix-blend-overlay">
  
          Coming 2022.

        </div>
     
      </div>

    </>
  );
};

export default Home;
