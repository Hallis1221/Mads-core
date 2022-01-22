import {
  ReactChild,
  ReactElement,
  ReactFragment,
  ReactPortal,
  useEffect,
  useState,
} from "react";
import Loading from "react-loading";
import { getContentWithID } from "../../../../lib/logic/requests/frontend";

export default function ContentsCard({
  contentIDS,
}: {
  contentIDS: string[];
}): ReactElement {
  let [contents, setContents] = useState([
    {
      theme: "",
      tags: [
        {
          tag: "",
          priority: 0,
        }
      ],
      title: "",
      link: "",
      id: "",
    },
  ]);

  useEffect(() => {
    let doneContents: string[] = [];
    let contents: any[] = [];
    contentIDS.map(async (contentID: string) => {
      if (!contentID || contentID == "" || doneContents.includes(contentID))
        return;
      await getContentWithID(contentID)
        .catch((err) => {
          console.log("Error getting content");
        })
        .then((content) => {
          contents.push(content);
          if (contents.length >= contentIDS.length) setContents(contents);
        });
    });
  }, [contentIDS]);

  console.log(contents);
  if (!contents) return <Loading />;
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
                  <div className="text-sm font-semibold text-right text-[#3751FF] cursor-pointer hover:text-blue-800"> 
                    Read more 
                    </div>
                </div>
                <div className="text-sm font-light text-left text-[#9FA2B4] text-opacity-50 italic pt-2 pb-5"> 
                    Read more about your {content.tags[0].tag} content with theme of {content.theme}
                    
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
