import { ReactElement } from "react";

export default function DashboardTopRow({
  title,
}: {
  title: string;
}): ReactElement {
  return (
    <div className="w-full  h-36 ">
      <div className="text-3xl  font-bold pt-5 tracking-no">{title}</div>
    </div>
  );
}
