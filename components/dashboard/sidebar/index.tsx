import Icon, { Icons } from "awesome-react-icons";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

type DItem = {
  id: number;
  title: string;
  link: string;
  icon: Icons;
};

export default function SideBar() {
  const router = useRouter();
  let selected: number;

  let items: DItem[] = [
    {
      id: 1,
      title: "Overview",
      link: "/creator/dashboard",
      icon: "briefcase",
    },
    {
      id: 2,
      // Later one this will be a page of all submissions and not just the submit page
      title: "Submit",
      link: "/creator/dashboard/submit",
      icon: "plus",
    }
  ];

  items.forEach((item) => {
    if (item.link === router.route) selected = item.id;
  });

  return (
    <div className="h-full w-80 bg-white rounded-r-3xl lg:hidden 2xl:block">
      <div className="flex flex-col pt-7">
        <Image src="/mads.svg" height={50} width={50} alt="Mads logo" />
      </div>
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
  );
}
