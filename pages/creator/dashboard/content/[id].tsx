import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import MagicEmailSignin from "../../../../components/auth/signin";
import DashboardMainCol from "../../../../components/dashboard";
import InfoCard from "../../../../components/dashboard/cards/infocard";
import ChangeLogCard from "../../../../components/dashboard/chart/sidecard/changelog";
import SideBar from "../../../../components/dashboard/sidebar";
import {
  getContentDataWithID,
  getContentHistory,
  getContentWithID,
  updateContent,
} from "../../../../lib/api/requests/frontend";

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
        date: "",

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
  const [editing, setEditing] = useState(false);

  let [content, setContent] = useState({
    theme: "",
    title: "",
    tags: [{ tag: "", priority: "" }],
    link: "",
    id: "",
  });

  useEffect(() => {
    let totalViews = 0;
    let totalClicks = 0;
    let totalSkips = 0;
    if (!id || (id && id.length <= 12) || typeof id !== "string") return;
    getContentWithID(id as string)
      .then((content) => {
        getContentDataWithID(id as string).then(
          (stats: { views: number; clicks: number; skips: number }) => {
            totalClicks = stats.clicks;
            totalSkips = stats.skips;
            totalViews = stats.views;

            content.views = stats.views;
            content.clicks = stats.clicks;
            content.skips = stats.skips;
          }
        );
        setContent(content);
      })
      .catch((err) => {
        console.error(`Error fetching content with id: ${id}. ${err}`);
        return;
      });

    if (!session) return;
    getContentWithID(id as string).then((content) => {
      getContentHistory(id as string).then((contentStats) => {
        let chartData = contentStats.chartData.map((data: any) => {
          console.log("Got data for the ", data.now.date, " day of the month.");
          console.table(data);
          return {
            date: data.now.date,
            ...data,
          };
        });

        if (totalViews <= content.views) totalViews = content.views;
        if (totalClicks <= content.clicks) totalClicks = content.clicks;
        if (totalSkips <= content.skips) totalSkips = content.skips;

        if (typeof totalViews !== "number") totalViews = 0;
        if (typeof totalClicks !== "number") totalClicks = 0;
        if (typeof totalSkips !== "number") totalSkips = 0;

        setStats({
          views: totalViews.toString() || "N/A",
          clicks: totalClicks.toString() || "N/A",
          skips: totalSkips.toString() || "N/A",
          chartData: chartData,
        });
      });

      setContent(content);
      setLastUpdated(new Date(Date.now()).toLocaleString());
    });
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
    <>
      <Head>
        <title>Mads {content.title} dashboard </title>
      </Head>
      <main>
        <div className="relative h-screen w-full bg-[#F2F7FF] flex flex-row font-mulish">
          <SideBar />
          <div className="px-16 ">
            {editing ? (
              <Editable setContent={setContent} content={content} />
            ) : (
              <NotEditable setIsEditing={setEditing} content={content} />
            )}
            <div
              className="flex flex-row justify-start "
              onClick={() => {
                if (editing) {
                  setEditing(false);
                  console.log(content);
                  let tags = content.tags.map((tag: any) => {
                    return tag.tag;
                  });

                  updateContent(content.id, {
                    title: content.title,
                    link: content.link,
                    tags: tags,
                  }).then(() => {
                    toast.success("Content updated!");
                  });
                }
              }}
            >
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

                <div className={`h-32 w-72 mt-10 ml-0 rounded-3xl bg-white`}>
                  <div className="h-full flex flex-row justify-evenly items-center">
                    <Link
                      href={`/content/${content.id}`}
                      replace={false}
                      passHref
                    >
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
    </>
  );
}
function Editable({
  setContent,
  content,

}: {
  setContent: any;
  content: {
    theme: string;
    title: string;
    tags: { tag: string; priority: string }[];
    link: string;
    id: string;
  };
}) {
  return (
    <div className="flex flex-row font-poppins h-36 pt-3 ">
      <div className="text-3xl pt-7 tracking-no">
        <input
          className="font-semibold bg-transparent border-none border-0 w-72"
          type="text"
          maxLength={25}
          minLength={3}
          placeholder={content.title}
          onChange={(e) => {
            if (e.target.value.startsWith(" ")) return;
            else content.title = e.target.value;
          }}
        />
      </div>
      <div className="text-3xl  font-bold tracking-no flex flex-row pt-0">
        {" "}
        {content.tags.map((tag: { tag: string | undefined }) => {
          return (
            <div
              className="text-sm text-white font-bold pt-0 h-fit ml-2 tracking-no rounded-full  bg-red-500"
              key={(Date.now()*Math.random()*10).toString()}
            >
              <div className="p-2">
                <input
                  className="w-16 bg-transparent border-none border-0 text-white"
                  type="text"
                  maxLength={10}
                  minLength={1}
                  placeholder={tag.tag}
                  onChange={(e) => {
                    if (e.target.value.startsWith(" ")) return;
                    else tag.tag = e.target.value;
                  }}
                />
              </div>
            </div>
          );
        })}
        <div
          className="text-sm text-white font-bold pt-0 h-fit ml-2 tracking-no rounded-2xl  bg-blue-500"
          onClick={() => {
            if (content.tags.length <= 5) {
              content.tags.push({ tag: "", priority: "0" });
              setContent({
                ...content,
                tags: content.tags,
              });
            } else toast.error("You can only have 5 tags");
          }}
        >
          <div className="p-2">
            <div className="w-5 bg-transparent border-none border-0 text-white text-center">
              +
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotEditable({
  setIsEditing,
  content,
}: {
  setIsEditing: (arg0: boolean) => void;
  content: {
    theme: string;
    title: string;
    tags: { tag: string; priority: string }[];
    link: string;
    id: string;
  };
}) {
  return (
    <button
      className="font-semibold"
      onDoubleClick={() => {
        setIsEditing(true);
      }}
    >
      <div className="flex flex-row font-poppins h-36 pt-3 ">
        <div className="text-3xl pt-7 tracking-no"> {content.title}</div>
        <div className="text-3xl  font-bold tracking-no flex flex-row pt-0">
          {" "}
          {content.tags.map((tag) => {
            return (
              <div
                className="text-sm text-white font-bold pt-0 h-fit ml-2 tracking-no rounded-full  bg-red-500"
                key={tag.tag + Date.now().toString()}
              >
                <div className="p-2">{tag.tag}</div>
              </div>
            );
          })}
        </div>
      </div>
    </button>
  );
}
