import Image from "next/image";

export default function SideBar() {
  return (
    <div className="h-full w-80 bg-white rounded-r-3xl">
      <div className="flex flex-col pt-7">
        <Image src="/mads.svg" height={50} width={50} alt="Mads logo" />
      </div>
      <div className="flex flex-col pl-10 pt-16 ">
        <div className="flex flex-row items-center">
          <Icon
            name="briefcase"
            className="text-[#D9DAE1]"
            size={30}
            strokeWidth={2.25}
          />
          <div className="pl-7 text-xl">Overview</div>
        </div>
      </div>
    </div>
  );
}
