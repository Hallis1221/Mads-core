import Icon, { Icons } from "awesome-react-icons";
import { ReactElement } from "react";

export default function InfoCard({
    title,
    value,
    icon,
    color,
    starting = false,
  }: {
    title: string;
    value: number | string;
    icon: Icons;
    color: string;
    starting?: boolean;
  }): ReactElement {
    if (value === 0) {
      value = "N/A";
    }
    return (

      <div
        className={`h-32 w-72 ${
          starting ? "ml-0" : "ml-16"
        } rounded-3xl bg-white`}
      >
        <div className="h-full flex flex-row justify-evenly items-center">
          <div
            className={`               w-16 h-16 rounded-2xl flex flex-col text-center`}
            style={{ backgroundColor: color }}
          >
            <div className="m-auto">
              <Icon name={icon} className="text-white" size={40} />
            </div>
          </div>
          <div className="flex flex-col justify-center items-center pr-6">
            <div className="text-[#9FA2B4] text-center">{title}</div>
            <div className="text-4xl text-center font-bold">{
              value === "N/A" ? "..." : value
            }</div>
          </div>
        </div>
      </div>

    );
  }