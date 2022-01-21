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
  const [lastUpdated , setLastUpdated] = useState("Fetching...");
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
    if (!session) return;

    getCreatorPerformance().then((res) => {
      let creatorPerformance = res.getUserContentPerformances;
      if (!creatorPerformance) return;

      let monthlyPerformance: Map<string, any> = new Map<string, any>();
      let oldMonthlyPerformance: Map<string, any> = new Map<string, any>();

      creatorPerformance.forEach(
        (content: {
          views: number;
          clicks: number;
          skips: number;
          contentID: string;
        }) => {
          getContentDataHistory(content.contentID, undefined).then(
            (contentDataHistory) => {
              monthlyPerformance = getHistory(
                contentDataHistory,
                content,
                monthlyPerformance
              );

              // Add up all the monthly data to get the total views, clicks, and skips
              let totalViews = 0;
              let totalClicks = 0;
              let totalSkips = 0;

              monthlyPerformance.forEach((value) => {
                totalViews += value.views;
                totalClicks += value.clicks;
                totalSkips += value.skips;
              });

              let chartData = createChartData(
                monthlyPerformance,
                oldMonthlyPerformance
              );

              let lastUpdated = new Date().toLocaleString();
              setLastUpdated(lastUpdated);
                
              // setStats
              setStats({
                views: totalViews,
                clicks: totalClicks,
                skips: totalSkips,
                chartData,
              });
            }
          );
          getOldContentDataHistory(content.contentID, undefined).then(
            (contentDataHistory) => {
              oldMonthlyPerformance = getHistory(
                contentDataHistory,
                content,
                oldMonthlyPerformance
              );

              // Add up all the monthly data to get the total views, clicks, and skips
              let totalViews = 0;
              let totalClicks = 0;
              let totalSkips = 0;

              monthlyPerformance.forEach((value) => {
                totalViews += value.views;
                totalClicks += value.clicks;
                totalSkips += value.skips;
              });

              let chartData = createChartData(
                monthlyPerformance,
                oldMonthlyPerformance
              );

              // setStats
              setStats({
                views: totalViews,
                clicks: totalClicks,
                skips: totalSkips,
                chartData,
              });
            }
          );
        }
      );
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
              lastUpdated={lastUpdated}
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

function DashboardMainCol({
  views,
  clicks,
  skips,
  chartData,
  lastUpdated,
}: {
  views: number;
  clicks: number;
  skips: number;
  chartData: Array<any>;
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
      <ChartCard chartData={chartData} lastupdated={lastUpdated} />
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
  let cd: any = [];

  for (let key of Array.from(dailyHistory.keys())) {
    let last = oldDailyHistory.get(key as string);
    let now = dailyHistory.get(key as string);

    let map: {
      now: { views: number; clicks: number; skips: number; date: String };
      last: { views: number; clicks: number; skips: number };
    } = {
      now: {
        views: 0,
        clicks: 0,
        skips: 0,
        date: key.split("-")[2].toString() + "th",
      },
      last: { views: 0, clicks: 0, skips: 0 },
    };

    if (now) {
      map.now = {
        views: now.views,
        clicks: now.clicks,
        skips: now.skips,
        date: key.split("-")[2].toString() + "th",
      };
    }

    if (last) {
      map.last = {
        views: last.views,
        clicks: last.clicks,
        skips: last.skips,
      };
    }

    cd.push(map);
  }

  return cd;
}

function getHistory(
  history: {
    d: { contentID: string; clicks: number; views: number; skips: number };
    t: string;
  }[],
  content: { contentID: string },
  performance: any
) {
  if (!history) return;

  let dailyContentPerformances: Map<string, any> = new Map<string, any>();

  history.forEach(
    (data: {
      d: {
        contentID: string;
        clicks: number;
        views: number;
        skips: number;
      };
      t: string;
    }) => {
      if (data.d.contentID === content.contentID) {
        // Create time key with format YYYY-MM-DD
        let timeKey = data.t.substring(0, 10);

        // Ensure we are setting data that is higher than the previous entry (so we do not overwrite new data with old data)
        let views = data.d.views;
        let clicks = data.d.clicks;
        let skips = data.d.skips;

        if (dailyContentPerformances.has(timeKey)) {
          if (dailyContentPerformances.get(timeKey).views > views)
            views = dailyContentPerformances.get(timeKey).views;
          if (dailyContentPerformances.get(timeKey).clicks > clicks)
            clicks = dailyContentPerformances.get(timeKey).clicks;
          if (dailyContentPerformances.get(timeKey).skips > skips)
            skips = dailyContentPerformances.get(timeKey).skips;
        }

        dailyContentPerformances.set(timeKey, {
          views,
          clicks,
          skips,
        });
      }
    }
  );

  // Ensure dailyContentPerformances is accounted for the fact that each day has the total and not just the total for the day by subtracting the last day's data from the current day's data, if there is data for the previous day
  let accountedDailyContentPerformances: Map<string, any> =
    dailyContentPerformances;

  accountedDailyContentPerformances.forEach((value, key) => {
    let day: string | number = parseInt(key.split("-")[2]) - 1;
    let month: string | number = parseInt(key.split("-")[1]);
    let year = parseInt(key.split("-")[0]);

    // Ensure day and month always have 2 digits
    if (day < 10) day = "0" + day;
    if (month < 10) month = "0" + month;

    let previousDayData = accountedDailyContentPerformances.get(
      `${year}-${month}-${day}`
    );

    if (!previousDayData) return;
    // Ensure the data we are subtracting is not undefined nor higher than the current day's data
    if (value.views < previousDayData.views)
      value.views += previousDayData.views;

    if (value.clicks < previousDayData.clicks)
      value.clicks += previousDayData.clicks;

    if (value.skips < previousDayData.skips)
      value.skips += previousDayData.skips;

    accountedDailyContentPerformances.set(key, {
      views: value.views - previousDayData.views,
      clicks: value.clicks - previousDayData.clicks,
      skips: value.skips - previousDayData.skips,
    });
  });

  // Merge accountedDailyContentPerformances with monthlyPerformance
  accountedDailyContentPerformances.forEach((value, key) => {
    if (performance.has(key)) {
      performance.set(key, {
        views: performance.get(key).views + value.views,
        clicks: performance.get(key).clicks + value.clicks,
        skips: performance.get(key).skips + value.skips,
      });
    } else {
      performance.set(key, {
        views: value.views,
        clicks: value.clicks,
        skips: value.skips,
      });
    }
  });

  return performance;
}
/*
  // Add up all the monthly data to get the total views, clicks, and skips
  let totalViews = 0;
  let totalClicks = 0;
  let totalSkips = 0;

  monthlyPerformance.forEach((value) => {
    totalViews += value.views;
    totalClicks += value.clicks;
    totalSkips += value.skips;
  });

  let lastMontlyPerformance: Map<string, any> = new Map<
    string,
    any
  >();

  let chartData = createChartData(
    monthlyPerformance,
    lastMontlyPerformance
  );

  // setStats
  setStats({
    views: totalViews,
    clicks: totalClicks,
    skips: totalSkips,
    chartData,
  }); */
