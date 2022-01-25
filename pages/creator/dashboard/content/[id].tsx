import Icon from "awesome-react-icons";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loading from "react-loading";
import MagicEmailSignin from "../../../../components/auth/signin";
import DashboardMainCol from "../../../../components/dashboard";
import InfoCard from "../../../../components/dashboard/cards/infocard";
import ChartCard from "../../../../components/dashboard/chart/chartcard";
import ChangeLogCard from "../../../../components/dashboard/chart/sidecard/changelog";
import ContentsCard from "../../../../components/dashboard/chart/sidecard/contents";
import SideBar from "../../../../components/dashboard/sidebar";
import DashboardTopRow from "../../../../components/dashboard/toprow";
import getOwner from "../../../../lib/data/owns";
import getContent from "../../../../lib/logic/dashboard/getData/getContent";
import { getContentData } from "../../../../lib/logic/requests/backend";
import { getContentWithID } from "../../../../lib/logic/requests/frontend";

export default function Page() {
  const router = useRouter();
  const { data: session } = useSession();

  const { id } = router.query;

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

  const [lastUpdated, setLastUpdated] = useState("Fetching...");

  let [content, setContent] = useState({
    theme: "",
    title: "",
    tags: [{ tag: "", priority: "" }],
    link: "",
    id: "",
  });

  useEffect(() => {
    if (!id || (id && id.length <= 12) || typeof id !== "string") return;
    getContentWithID(id as string)
      .then((content) => {
        getContentData(id as string, "").then(
          (stats: { views: number; clicks: number; skips: number }) => {
            console.log(stats);
            content.views = stats.views;
            content.clicks = stats.clicks;
            content.skips = stats.skips;
          }
        );
        setContent(content);
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  }, [id]);

  useEffect(() => {
    if (!session) return;
    getContent(setLastUpdated, setStats, id as string);
  }, [id, session]);

  if (!content) return <div>Content not found</div>;

  if (!session)
    return (
      <div className="w-screen flex flex-col justify-center items-center">
        Not signed in <br />
        <MagicEmailSignin />
      </div>
    );
  return (
    <main>
      <div className="relative h-screen w-full bg-[#F2F7FF] flex flex-row font-mulish">
        <SideBar />
        <div className="px-16 ">
          <div className="flex flex-row font-poppins h-36 pt-3 ">
            <div className="text-3xl  font-semibold pt-7 tracking-no">
              {content.title}
            </div>
            <div className="text-3xl  font-bold tracking-no">
              {" "}
              {content.tags.map((tag) => {
                return (
                  <div
                    className="text-sm text-white font-bold pt-0 tracking-no rounded-full  bg-red-500"
                    key={tag.tag}
                  >
                    <div className="p-2">{tag.tag}</div>
                  </div>
                );
              })}
            </div>
          </div>
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

              <div className={`h-32 w-72 mt-10 ml-0 rounded-3xl bg-white`}>
                <div className="h-full flex flex-row justify-evenly items-center">
                <Link href={`/content/${content.id}`} replace={false} passHref>
                  <a target="_blank">
                    <div className="text-2xl font-semibold text-right text-[#3751FF] cursor-pointer hover:text-blue-800">
                      View live
                    </div>
                  </a>
                </Link>
              
                </div>
              </div>

              <ChangeLogCard
                changes={[
                  {
                    title: "Content created",
                    description: "The content was created",
                    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
