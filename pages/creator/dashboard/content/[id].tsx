import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loading from "react-loading";
import MagicEmailSignin from "../../../../components/auth/signin";
import DashboardMainCol from "../../../../components/dashboard";
import InfoCard from "../../../../components/dashboard/cards/infocard";
import ChartCard from "../../../../components/dashboard/chart/chartcard";
import ContentsCard from "../../../../components/dashboard/chart/sidecard";
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

        <div className="flex flex-col">
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
          </div>
          <div className="px-16 ">
            <div className="w-full flex flex-row font-poppins h-fit pt-3 ">
              <div className="p-7 tracking-no bg-[#fafafa] rounded-md flex flex-col text-center items-center">
                <Link href={`/content/${content.id}`} replace={false} passHref>
                <a target="_blank">
                  <div className="text-2xl font-semibold text-right text-[#3751FF] cursor-pointer hover:text-blue-800">
                    View live
                  </div>
                  </a>
                </Link>
                <div className="flex flex-row">
                  <div className="text-xl font-bold pr-2">Ad space: </div>
                  <div className="text-xl font-medium">{content.theme}</div>
                </div>
                <div className="flex flex-row">
                  <div className="text-xl font-bold pr-2">Content id: </div>
                  <div className="text-xl font-medium">{content.id}</div>
                </div>
                <div className="flex flex-row">
                  <div className="text-xl font-bold pr-2">Last updated: </div>
                  <div className="text-xl font-medium">{lastUpdated}</div>
                </div>
                <div className="flex flex-row">
                  <div className="text-xl font-bold pr-2">Clicks: </div>
                  <div className="text-xl font-medium">{stats.clicks}</div>
                </div>
                <div className="flex flex-row">
                  <div className="text-xl font-bold pr-2">Skips: </div>
                  <div className="text-xl font-medium">{stats.skips}</div>
                </div>
                <div className="flex flex-row">
                  <div className="text-xl font-bold pr-2">Views: </div>
                  <div className="text-xl font-medium">{stats.views}</div>
                </div>
              </div>
              <div className="text-xl  font-bold tracking-no"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
