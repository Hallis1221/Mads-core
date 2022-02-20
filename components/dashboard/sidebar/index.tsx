import Icon, { Icons } from "awesome-react-icons";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import DItem from "../../../lib/types/dashboard/navigation";


export default function SideBar(
  {
    items
  }: {
    items: DItem[];
  }
) {
  const router = useRouter();
  let selected: number = 0;

  items.forEach((item) => {
    if (item.link === router.route) selected = item.id;
  });

  return (
    <>
      <div className="h-full w-80 bg-white rounded-r-3xl hidden 2xl:block">
        <div className="flex flex-col pt-7">
          <Image src="/mads.svg" height={50} width={50} alt="Mads logo" />
        </div>
        <div className="flex flex-col  px-3 pt-16  ">
          {items.map((item: DItem) => {
            return (
              <Link href={item.link} passHref key={item.id} prefetch>
                <div
                  className={`flex flex-row items-center py-3 px-9 text-[#fffff] rounded-xl hover:bg-slate-200 hover:text-white hover:cursor-pointer
              ${
                selected === item.id
                  ? "bg-[#435EBE] text-white"
                  : "bg-transparent"
              }`}
                >
                  <Icon
                    name={item.icon}
                    className="z-50"
                    size={30}
                    strokeWidth={2.25}
                  />
                  <div className="pl-7 text-xl font-bold">{item.title}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="h-full w-80 rounded-r-3xl 2xl:hidden block">
        <SideBarMobile items={items} selected={selected} />
      </div>
    </>
  );
}

export function SideBarMobile({
  items,
  selected,
}: {
  items: DItem[];
  selected: number;
}) {
  const [open, setOpen] = useState(false);

  if (!open)
    return (
      <Icon
        name="burger"
        className="absolute top-0 left-0 mt-5 ml-3 hover:cursor-pointer active:animate-ping"
        size={30}
        strokeWidth={2.25}
        onClick={async () => {
          await timeout(25);
          setOpen(true)
        }}
      />
    );
  else
    return (
      <>
        <div className="w-screen h-screen z-50 absolute flex flex-row">
          <div className="flex flex-col pt-7 h-full bg-white shadow-2xl w-3/4">
            <Image src="/mads.svg" height={50} width={50} alt="Mads logo" />
            <div className="flex flex-col  px-3 pt-16  ">
              {items.map((item: DItem) => {
                return (
                  <Link href={item.link} passHref key={item.id} prefetch>
                    <div
                      className={`flex flex-row items-center py-3 px-9 text-[#fffff] rounded-xl hover:bg-slate-200 hover:text-white hover:cursor-pointer
        ${selected === item.id ? "bg-[#435EBE] text-white" : "bg-transparent"}`}
                    >
                      <Icon
                        name={item.icon}
                        className=""
                        size={30}
                        strokeWidth={2.25}
                      />
                      <div className="pl-7 text-xl font-bold">{item.title}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
          <div
            className="blur-3xl h-full w-full cursor-pointer"
            onClick={() => {
              setOpen(false);
            }}
          />
        </div>
      </>
    );
}

function timeout(delay: number) {
  return new Promise( res => setTimeout(res, delay) );
}