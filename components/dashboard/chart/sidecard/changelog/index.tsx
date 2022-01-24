import Link from "next/link";
import { md5 } from "pure-md5";
import { ReactElement, useState, useEffect } from "react";
import Loading from "react-loading";
import { getContentWithID } from "../../../../../lib/logic/requests/frontend";

type Change = {
  title: string;
  description: string;
  date: Date;
};

export default function ChangeLogCard({
  changes,
}: {
  changes: Array<Change>;
}): ReactElement {
  if (!changes) return <Loading />;
  return (
    <div className="flex h-full w-full flex-1 flex-row justify-start pt-10 font-mulish ">
      <div className="grow h-fit max-h-[478px] w-10 bg-white rounded-3xl text-center font-semibold text-2xl pt-3 overflow-scroll no-scrollbar">
        Change log
        <div className="relative w-full h-[2px] mt-5 rounded-full bg-gray-200 " />
        <div className="flex flex-col justify-start pb-16 h-full pt-5 ">
          {changes.map((change) => {
            return (
              <div
                key={md5(change.title + change.description + change.date)}
                className="px-5 py-2"
              >
                <div className="flex flex-row justify-between items-center ">
                  <div className="text-left font-semibold text-lg  text-[#252733]">
                    {change.title}
                  </div>
                </div>
                <div className="text-sm font-light text-left text-[#9FA2B4] text-opacity-50 italic pt-2 pb-5">
                  On {change.date.toLocaleDateString()} the following changes
                  were made: {" "}
                  {change.description}
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
