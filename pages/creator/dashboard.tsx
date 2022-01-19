import Icon, { Icons } from "awesome-react-icons";
import { ReactElement, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Chart from "../../components/stats/charts";
import { getCreatorPerformance } from "../../lib/logic/requests/frontend";
import { useSession } from "next-auth/react";
import MagicEmailSignin from "../../components/auth/signin";
import {
  getContentDataHistory,
  getOldContentDataHistory,
} from "../../lib/logic/requests/backend";

// TODO move everything to mads core
export default function Dashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    views: 0,
    clicks: 0,
    skips: 0,
    chartData: [
      {
        now: {
          views: 0,
          clicks: 0,
          skips: 0,
        },
        last: {
          views: 0,
          clicks: 0,
          skips: 0,
        },
      },
    ],
  });

  useEffect(() => {
    if (session)
      getCreatorPerformance().then(async (res) => {
        let dailyHistory = new Map<
          String,
          {
            views: number;
            clicks: number;
            skips: number;
          }
        >();

        let oldDailyHistory = new Map<
          String,
          {
            views: number;
            clicks: number;
            skips: number;
          }
        >();

        let totalClicks = 0;
        let totalViews = 0;
        let totalSkips = 0;

        // iterate through the data and sum up the values using a for loop
        let data = res.getUserContentPerformances;
        for (let i = 0; i < data.length; i++) {
          let content: {
            views: number | undefined;
            clicks: number | undefined;
            skips: number | undefined;
            contentID: string;
          } = data[i];

          let history = await getContentDataHistory(content.contentID, null);
          let oldHistory = await getOldContentDataHistory(
            content.contentID,
            null
          );

          history.forEach((element: any) => {
            let content = element.d;
            let date = new Date(element.t);

            let dailyData = dailyHistory.get(
              `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`
            );

            if (dailyData) {
              // Content includes the total clicks, views, and skips. Not the daily ones.
              if (dailyData.views < content.views)
                dailyData.views = content.views;
              if (dailyData.clicks < content.clicks)
                dailyData.clicks = content.clicks;
              if (dailyData.skips < content.skips)
                dailyData.skips = content.skips;
            } else {
              dailyHistory.set(
                `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`,
                {
                  views: content.views,
                  clicks: content.clicks,
                  skips: content.skips,
                }
              );
            }
          });

          totalClicks += content.clicks || 0;
          totalViews += content.views || 0;
          totalSkips += content.skips || 0;

          oldHistory.forEach((element: any) => {
            let content = element.d;
            let date = new Date(element.t);

            let dailyData = oldDailyHistory.get(
              `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`
            );

            if (dailyData) {
              // Content includes the total clicks, views, and skips. Not the daily ones.
              dailyData.views = content.views;
              dailyData.clicks = content.clicks;
              dailyData.skips = content.skips;
            } else {
              oldDailyHistory.set(
                `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`,
                {
                  views: content.views,
                  clicks: content.clicks,
                  skips: content.skips,
                }
              );
            }
          });
        }

        let chartData = createChartData(dailyHistory, oldDailyHistory);

        setStats({
          clicks: totalClicks,
          views: totalViews,
          skips: totalSkips,
          chartData: chartData,
        });
      });
  }, [session]);

  if (!session)
    return (
      <div className="w-screen flex flex-col justify-center items-center">
        Not signed in <br />
        <MagicEmailSignin />
      </div>
    );
  return (
    <>
      <div className="relative h-screen w-full bg-[#F2F7FF] flex flex-row font-mulish">
        <SideBar />
        <div className="px-16 ">
          <DashboardTopRow />
          <div className="flex flex-row justify-start ">
            <DashboardMainCol
              views={stats.views}
              clicks={stats.clicks}
              skips={stats.skips}
              chartData={stats.chartData}
            />
            <div className="grow ml-16">
              <InfoCard
                color={"#FF7976"}
                title={"Estimated revenue"}
                value={
                  "$" +
                  (
                    stats.views * (1 / 1000) +
                    stats.clicks * (25 / 1000)
                  ).toFixed(3)
                }
                icon={"check-circle"}
                starting
              />

              <NewsCard />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function SideBar() {
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

function InfoCard({
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
          <div className="text-4xl text-center font-bold">{value}</div>
        </div>
      </div>
    </div>
  );
}

function ChartCard({ chartData }: { chartData: Array<any> }): ReactElement {
  return (
    <div className="flex w-full h-fit flex-1 flex-row justify-start pt-10">
      <div className="grow h-full w-10 bg-white rounded-3xl pt-6 px-7">
        <div className="flex flex-col items-start ">
          <div className="text-xl text-center font-bold  ">Monthly views</div>
          <div className="flex flex-row justify-between w-full ">
            <div className="text-[#9FA2B4] text-center">
              Last updated January 15th 2022, 22:46
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
            <Chart chartData={chartData} />
          </div>
        </div>
      </div>
    </div>
  );
}

function NewsCard(): ReactElement {
  return (
    <div className="flex h-full w-full flex-1 flex-row justify-start pt-10">
      <div className="grow h-96 w-10 bg-white rounded-3xl"></div>
    </div>
  );
}

function DashboardMainCol({
  views,
  clicks,
  skips,
  chartData,
}: {
  views: number;
  clicks: number;
  skips: number;
  chartData: Array<any>;
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
      <ChartCard chartData={chartData} />
    </div>
  );
}

function DashboardTitle(): ReactElement {
  return <div className="text-3xl  font-bold pt-5 tracking-no">Overview</div>;
}

function DashboardTopRow(): ReactElement {
  return (
    <div className="w-full  h-36 ">
      <DashboardTitle />
    </div>
  );
}

function createChartData(
  dailyHistory: Map<String, { views: number; clicks: number; skips: number }>,
  oldDailyHistory: Map<String, { views: number; clicks: number; skips: number }>  
): Array<any> {
  let chartData = [];
  // make sure we limit ourselves to the last 30 days
  let iteratedThrough = 0;
  for (let [key, value] of Array.from(dailyHistory)) {
    if (iteratedThrough > 30) break;
    chartData.push({
      now: {
        views: value.views,
        clicks: value.clicks,
        skips: value.skips,
        date: `${key.split("-")[0]}th`,
      },
      last: {
        views: oldDailyHistory.get(key)?.views || 0,
        clicks: oldDailyHistory.get(key)?.clicks || 0,
        skips: oldDailyHistory.get(key)?.skips || 0,
      },
    });

    iteratedThrough++;
  }
  return chartData;
}
