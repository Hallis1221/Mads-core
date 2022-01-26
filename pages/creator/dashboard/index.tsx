import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import MagicEmailSignin from "../../../components/auth/signin";
import DashboardMainCol from "../../../components/dashboard";
import InfoCard from "../../../components/dashboard/cards/infocard";
import SideBar from "../../../components/dashboard/sidebar";
import DashboardTopRow from "../../../components/dashboard/toprow";
import ReactLoading from "react-loading";
import getAllContent from "../../../lib/logic/dashboard/getData/getAllContent";
import ContentsCard from "../../../components/dashboard/chart/sidecard/contents";
import toast from "react-hot-toast";

// TODO move everything to mads core
export default function Dashboard() {
  const { data: session } = useSession();
  const [lastUpdated, setLastUpdated] = useState("Fetching...");
  const [isLoaded, setIsLoaded] = useState(false);
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
    if (!session?.user) return;
    getAllContent(setLastUpdated, setStats, setContents);
    setIsLoaded(true);
  }, [session?.user]);

  if (!isLoaded) return <ReactLoading type="spin" color="#fff" />;

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
  let contentStats = contents.map((content) => {
    return {
      contentID: content.contentID,
      views: content.views,
      clicks: content.clicks,
      skips: content.skips,
    };
  });

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

              <ContentsCard stats={contentStats} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
