import Icon from "awesome-react-icons";
import Image from "next/image";
import Link from "next/link";

export default function SideBar() {
  return (
    <div className="h-full w-80 bg-white rounded-r-3xl lg:hidden 2xl:block">
      <div className="flex flex-col pt-7">
        <Image src="/mads.svg" height={50} width={50} alt="Mads logo" />
      </div>
      <div className="flex flex-col  px-3 pt-16  ">
        <Link href={"/creator/dashboard"} passHref>
          <div className="flex flex-row items-center py-3 px-9 text-[#fffff] rounded-xl hover:bg-slate-200 hover:text-white hover:cursor-pointer">
            <Icon name="briefcase" className="" size={30} strokeWidth={2.25} />
            <div className="pl-7 text-xl font-bold">Overview</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
