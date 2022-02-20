import { ReactElement } from "react";
import TopAuth from "../../auth/topbar";

export default function DashboardTopRow({
  title,
}: {
  title: string;
}): ReactElement {
  return (
    <div className="pb-16">
    <div className="flex flex-row py-10 items-start justify-between h-0 z-1 ">
      <div className="text-3xl  font-bold pt-5 tracking-no">{title}</div>

      <TopAuth />
    </div>
    </div>
  );
}
