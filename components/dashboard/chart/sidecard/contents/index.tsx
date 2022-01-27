import {
  ReactChild,
  ReactElement,
  ReactFragment,
  ReactPortal,
  useEffect,
  useState,
} from "react";
import Loading from "react-loading";
import { getContentWithID } from "../../../../../lib/logic/requests/frontend";
import Link from "next/link";

export default function ContentsCard({ stats }: { stats: any }): ReactElement {
  let [contents, setContents] = useState([
    {
      views: 0,
      clicks: 0,
      skips: 0,
      contentID: "",
      id: "",
      title: "",
      tags: [{ tag: "", priority: 0 }],
    },
  ]);

  useEffect(() => {
    let doneContents: any[] = [];
    let ids = stats.map((content: { contentID: any }) => content.contentID);
    if (contents.length === ids.length) return;
    ids.forEach((id: string) => {
      if (id != "")
        getContentWithID(id).then((content: any) => {
          let contentStats = stats.find(
            (content: { contentID: any }) => content.contentID == id
          );

          content = {
            ...content,
            views: contentStats.views,
            clicks: contentStats.clicks,
            skips: contentStats.skips,
          };
          if (doneContents.includes(content)) return;
          doneContents.push(content);
          doneContents.sort((a: {views: number}, b: {views: number}) => {
            if (a.views > b.views) return -1;
            if (a.views < b.views) return 1;
            return 0;
          });

          if (doneContents.length >= stats.length) setContents(doneContents);
        });
    });
  }, [contents.length, stats]);

  if (!contents || contents.length <= 0 || (contents.length === 1 && contents[0].contentID === "")) return <Loading />;
  return (
    <div className="flex h-full w-full flex-1 flex-row justify-start pt-10 font-mulish ">
      <div className="grow h-fit max-h-[478px] w-10 bg-white rounded-3xl text-center font-semibold text-2xl pt-3 overflow-scroll no-scrollbar">
        My content
        <div className="relative w-full h-[2px] mt-5 rounded-full bg-gray-200 " />
        <div className="flex flex-col justify-start pb-16 h-full pt-5 ">
          {contents.map((content) => {
            return (
              <div key={content.id} className="px-5 py-2">
                <div className="flex flex-row justify-between items-center ">
                  <div
                    className="text-left font-semibold text-lg  text-[#252733]"
                    key={content.id}
                  >
                    {content.title}
                  </div>
                  <Link href={`dashboard/content/${content.id}`} passHref>
                  <div className="text-sm font-semibold text-right text-[#3751FF] cursor-pointer hover:text-blue-800">
                    Read more
                  </div>
                  </Link>
                </div>
                <div className="text-sm font-light text-left text-[#9FA2B4] text-opacity-50 italic pt-2 pb-5">
                  Your {content.tags[0].tag} content has been viewed{" "}
                  {content.views} and clicked {content.clicks} times. That is a
                  click through rate of {(content.clicks / content.views) *100}%. {
                    ((content.clicks / content.views) > 0.5)
                      ? "Amazing!!!!"
                      : ((content.clicks / content.views) > 0.2)
                      ? "Good job!"
                      : ((content.clicks / content.views) > 0.1)
                      ? "Not bad!"
                      : "You will get there!"
                  }
                </div>
                <div className="relative w-full h-[2px] rounded-full bg-gray-200 " />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
