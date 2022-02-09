import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import MagicEmailSignin from "../../../components/auth/signin";
import DashboardMainCol from "../../../components/dashboard";
import InfoCard from "../../../components/dashboard/cards/infocard";
import SideBar from "../../../components/dashboard/sidebar";
import DashboardTopRow from "../../../components/dashboard/toprow";
import ReactLoading from "react-loading";
import ContentsCard from "../../../components/dashboard/chart/sidecard/contents";
import toast from "react-hot-toast";
import Head from "next/head";
import {
  getAllUserContent,
  getAllUserContentFull,
  getContentDataWithID,
  getContentWithID,
} from "../../../lib/api/requests/frontend";
import { ContentData } from "../../../lib/types/data/contentData";
import ChartCard from "../../../components/dashboard/chart/chartcard";

// TODO move everything to mads core
export default function Dashboard() {
  const { data: session } = useSession();
  const [lastUpdated, setLastUpdated] = useState("Fetching...");
  const [contents, setContents] = useState([
    { views: 0, clicks: 0, skips: 0, contentID: "" },
  ]);

  const [stats, setStats] = useState({
    views: "N/A" || 0,
    clicks: "N/A" || 0,
    skips: "N/A" || 0,
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
    if (session && session.user) {
    toast.dismiss();
      toast.loading(
        "Started fetching data... This could take up to 30 seconds."
      );
      getAllUserContentFull().then((res: any) => {
        console.table(res);
        setStats({
          views: res[0].views,
          clicks: res[0].clicks,
          skips: res[0].skips,
          chartData: res[0].chartData,
        });

        let totalViews = 0;
        let totalClicks = 0;
        let totalSkips = 0;

        // Calculate total views, clicks, and skips
        res.forEach((content: ContentData) => {
          totalViews += content.views || 0;
          totalClicks += content.clicks || 0;
          totalSkips += content.skips || 0;
        });

        // Combine all the chartdata into one array by combining the same data in now and last
        let combinedChartData: any = [];
        res.forEach((content: any) => {
          content.chartData.forEach((data: any) => {
            // Check if the combinedChartData already has the same date
            let combinedChartDataIndex = combinedChartData.findIndex(
              (ccdi: any) => ccdi.date == data.now.date
            );

            if (combinedChartDataIndex == -1) {
              // If it doesn't, add it
              combinedChartData.push({
                date: data.now.date,
                now: {
                  date: data.now.date,
                  views: data.now.views,
                  clicks: data.now.clicks,
                  skips: data.now.skips,
                },
                last: {
                  views: data.last.views,
                  clicks: data.last.clicks,
                  skips: data.last.skips,
                },
              });
            } else {
              // If it does, add the data to the combinedChartData
              combinedChartData[combinedChartDataIndex].now.views +=
                data.now.views;
              combinedChartData[combinedChartDataIndex].now.clicks +=
                data.now.clicks;
              combinedChartData[combinedChartDataIndex].now.skips +=
                data.now.skips;
            }
          });
        });

        // Set the combinedChartData to the stats
        setStats({
          views: totalViews.toString() || "",
          clicks: totalClicks.toString() || "",
          skips: totalSkips.toString() || "",
          chartData: combinedChartData || [],
        });

        setLastUpdated(new Date(Date.now()).toLocaleString());

        // Let contents be the res without the chartData
        // Remove the chartData from the res
        let contents = res.map((content: any) => {
          totalViews += content.views;
          totalClicks += content.clicks;
          totalSkips += content.skips;
          return {
            views: content.views,
            clicks: content.clicks,
            skips: content.skips,
            contentID: content.contentID,
          };
        });

        setContents(contents);
      });
    }
  }, [session]);

  if (!session?.user)
    return (
      <div className="w-screen flex flex-col justify-center items-center">
        Not signed in <br />
        <MagicEmailSignin />
      </div>
    );

  let contentIDS = contents
    .map((content) => content.contentID)
    .filter((contentID) => contentID != "");

  if (
    stats &&
    typeof stats.views == "number" &&
    typeof stats.clicks == "number" &&
    (parseInt(stats.clicks) / parseInt(stats.views)) * 100 > 75 &&
    contentIDS.length > 0 &&
    parseInt(stats.views) >= 50
  ) {
    toast.dismiss();
    toast(
      "You have a click through rate above 75%. Your account may be flagged for suspicious activity.",
      {
        icon: "⚠️",
        duration: 10000,
      }
    );
  }

  if (stats.chartData && stats && stats.views != "N/A") toast.dismiss();
  console.info(
    `Rerendering dashboard with ${contents.length} contents. Logged in as ${session.user.email}`
  );

  return (
    <>
      <Head>
        <title>Mads Dashboard | {session.user.name}</title>
      </Head>
      <div className="relative h-screen w-full bg-[#F2F7FF] overflow-hidden flex flex-row font-mulish">
        <SideBar />
        <div className="px-16 hidden xl:block">
          <DashboardTopRow />
          <DesktopDashboard
            contents={contents}
            stats={stats}
            lastUpdated={lastUpdated}
          />
        </div>
        <div className="px-16 block xl:hidden">
          <div className="absolute top-0 left-14">
            {" "}
            <DashboardTopRow />
          </div>

          <MobileDashboard
            contents={contents}
            stats={stats}
            lastUpdated={lastUpdated}
          />
        </div>
      </div>
    </>
  );
}

function DesktopDashboard({
  stats,
  lastUpdated,
  contents,
}: {
  stats: {
    views: string;
    clicks: string;
    skips: string;
    chartData: {
      now: { views: number; clicks: number; skips: number };
      last: { views: number; clicks: number; skips: number };
    }[];
  };
  lastUpdated: string;
  contents: {
    views: number;
    clicks: number;
    skips: number;
    contentID: string;
  }[];
}) {
  return (
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
            stats.views === "0" || stats.clicks === "0"
              ? "N/A"
              : "$" +
                (
                  parseInt(stats.views) * (1 / 1000) +
                  parseInt(stats.clicks) * (25 / 1000)
                ).toFixed(3)
          }
          icon={"check-circle"}
          starting
        />

        <ContentsCard
          stats={contents.map((content) => {
            return {
              contentID: content.contentID,
              views: content.views,
              clicks: content.clicks,
              skips: content.skips,
            };
          })}
        />
      </div>
    </div>
  );
}

function MobileDashboard({
  stats,
  lastUpdated,
  contents,
}: {
  stats: {
    views: string;
    clicks: string;
    skips: string;

    chartData: {
      now: { views: number; clicks: number; skips: number };
      last: { views: number; clicks: number; skips: number };
    }[];
  };
  lastUpdated: string;
  contents: {
    views: number;
    clicks: number;
    skips: number;
    contentID: string;
  }[];
}) {
  return (
    <div className="pt-24">
      <div className="flex flex-col ">
        <div className="flex w-full flex-row justify-evenly absolute left-0">
          <InfoCard
            title={"Total Views"}
            color={"#57CAEB"}
            value={stats.views}
            icon={"bell-off"}
            starting
            compact
          />
          <InfoCard
            title={"Total Clicks"}
            color={"#57CAEB"}
            value={stats.clicks}
            icon={"bell-off"}
            starting
            compact
          />
        </div>
        <div className="flex w-full flex-row justify-evenly absolute left-0 top-56">
          <InfoCard
            title={"Total skips"}
            color={"#57CAEB"}
            value={stats.skips}
            icon={"bell-off"}
            starting
            compact
          />
          <InfoCard
            title={"Total revenue"}
            color={"#57CAEB"}
            value={
              stats.views === "0" || stats.clicks === "0"
                ? "N/A"
                : "$" +
                  (
                    parseInt(stats.views) * (1 / 1000) +
                    parseInt(stats.clicks) * (25 / 1000)
                  ).toFixed(3)
            }
            icon={"bell-off"}
            starting
            compact
          />
        </div>
      </div>
    </div>
  );
}
