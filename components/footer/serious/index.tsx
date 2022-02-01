import Image from "next/image";

export default function SeriousFooter() {
    return <footer className="flex flex-1 flex-row py-8 px-0 border-t-2 border-solid text-xl border-gray-300 justify-center items-center w-full">
 
        Made with ❤️ by hallis.

    Powered by <a href="https://5framestudios.com" target="_blank" className="h-8 w-28 mx-3 relative" rel="noreferrer"> <Image src="/5fs.png" layout="fill" alt="5 frame studios logo" /></a>
    
    </footer>;
  }
  