// !! https://github.com/avneesh0612/animated-sidebar/blob/main/src/Sidebar.js

import { useState } from "react";
import Icon from "awesome-react-icons/lib/cjs/Icon";
import Image from "next/image";

export default function Sidebar({ children }: any) {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className={`fixed top-0 left-0 w-full sm:w-[50vw] lg:w-[35vw] h-screen ${showSidebar ? 'z-50' : '-z-10'}`}>
      {showSidebar ? (
        <div
          className='relative px-5 pt-5 flex flex-row justify-between bg-blue-600 ease-in-out  duration-300 ${
            showSidebar ? "translate-x-0 " : "-translate-x-full"
          }'
        >
          <Icon
            name="x"
            size={50}
            className="relative flex text-white items-center cursor-pointer"
            title={"Closing icon"}
            onClick={() => setShowSidebar(false)}
          />
          <Image
            src="/mads.svg"
            height={50}
            width={125}
            alt="Mads logo"
            className="relative"
          />
        </div>
      ) : (
        <Icon
          name="burger"
          size={50}
          className="fixed  z-30 flex items-center cursor-pointer left-10 top-6"
          onClick={() => setShowSidebar(true)}
        />
      )}

      <div
        className={`  bg-blue-600  p-10 pl-20 text-white relative h-full ease-in-out  duration-300 ${
          showSidebar ? "translate-x-0 " : "-translate-x-full"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
