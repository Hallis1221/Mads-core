import { useEffect, useState } from "react";
import { getCreatorPerformance } from "../../lib/logic/requests/frontend";
import { useSession } from "next-auth/react";
import MagicEmailSignin from "../../components/auth/signin";
import {
  getContentDataHistory,
  getOldContentDataHistory,
} from "../../lib/logic/requests/backend";
import DashboardMainCol from "../../components/dashboard";
import InfoCard from "../../components/dashboard/cards/infocard";
import NewsCard from "../../components/dashboard/chart/sidecard";
import SideBar from "../../components/dashboard/sidebar";
import DashboardTopRow from "../../components/dashboard/toprow";
import createChartData from "../../lib/logic/dashboard/createChartData";
import getAllContent from "../../lib/logic/dashboard/getData/getAllContent";

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
    getAllContent(setLastUpdated, setStats);

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