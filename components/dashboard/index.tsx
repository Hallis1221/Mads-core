import { ReactElement } from "react";
import InfoCard from "./cards/infocard";
import ChartCard from "./chart/chartcard";

export default function DashboardMainCol({
  views,
  clicks,
  skips,
  chartData,
  lastUpdated,

}: {
  views: number | string;
  clicks: number | string;
  skips: number | string;
  chartData: Array<any> | undefined;
  lastUpdated: string;

}): ReactElement {

    return (
      <div className="w-3/4 flex h-full flex-col justify-start items-center">
        <div className="w-full flex flex-row justify-start">
          <InfoCard
            color="#9694FF"
            title={"Total views"}
            value={views}
            icon={"eye"}
            starting
          />
          <InfoCard
            title={"Total clicks"}
            value={clicks}
            icon={"check-square"}
            color={"#5DDAB4"}
          />

          <InfoCard
            title={"Total skips"}
            color={"#57CAEB"}
            value={skips}
            icon={"bell-off"}
          />
        </div>
        {chartData ? (
          <ChartCard chartData={chartData} lastupdated={lastUpdated} />
        ) : (
          <></>
        )}
      </div>
    );

}
