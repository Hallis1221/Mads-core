import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import MagicEmailSignin from "../../components/auth/signin";
import DashboardMainCol from "../../components/dashboard";
import InfoCard from "../../components/dashboard/cards/infocard";
import NewsCard from "../../components/dashboard/chart/sidecard";
import SideBar from "../../components/dashboard/sidebar";
import DashboardTopRow from "../../components/dashboard/toprow";import ReactLoading from 'react-loading';
import getAllContent from "../../lib/logic/dashboard/getData/getAllContent";

// TODO move everything to mads core
export default function Dashboard() {
  const { data: session } = useSession();
  const [lastUpdated, setLastUpdated] = useState("Fetching...");
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
                  typeof stats.views === "string" ||
                  typeof stats.clicks === "string"
                    ? "N/A"
                    : "$" +
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
