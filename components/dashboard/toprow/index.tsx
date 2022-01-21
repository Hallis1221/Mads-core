import { ReactElement } from "react";
import DashboardTitle from "./title";

export default function DashboardTopRow(): ReactElement {
  return (
    <div className="w-full  h-36 ">
      <DashboardTitle />
    </div>
  );
}
