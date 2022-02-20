import { ReactElement } from "react";
import Chart from "../../../stats/charts";
import ReactLoading from "react-loading";

export default function ChartCard({
  chartData,
  lastupdated,
}: {
  chartData: Array<any>;
  lastupdated: string;
}): ReactElement {
  return (
    <div className="flex w-full h-fit flex-1 flex-row justify-start pt-10">
      <div className="grow h-full w-10 bg-white rounded-3xl pt-6 px-7">
        <div className="flex flex-col items-start ">
          <div className="text-xl text-center font-bold  ">Monthly views</div>
          <div className="flex flex-row justify-between w-full ">
            <div className="text-[#9FA2B4] text-center">
              Last updated {lastupdated}
            </div>
            <div className="flex flex-row items-center">
              <div className="flex flex-row items-center">
                <div className="relative w-7 h-1 rounded-full bg-[#3751FF] " />
                <div className="text-[#9FA2B4] font-medium pl-2 text-sm">
                  This month
                </div>
              </div>
              <div className="flex flex-row items-center pl-5">
                <div className="relative w-7 h-1 rounded-full bg-[#DFE0EB] " />
                <div className="text-[#9FA2B4] font-medium pl-2 text-sm">
                  Last month
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 grow w-full h-96">
            {(chartData.length <= 0 || !chartData) ? (
              <div className="w-full flex flex-row items-end justify-center">
                <ReactLoading
                  type={"bubbles"}
                  color={"#3751FF"}
                  delay={5}
                  height={"20%"}
                  width={"20%"}
                />
              </div>
            ) : 
              
            (
              <Chart data={chartData} length={chartData.length} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
