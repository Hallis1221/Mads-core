import { ReactElement } from "react";

export default function NewsCard(): ReactElement {
  return (
    <div className="flex h-full w-full flex-1 flex-row justify-start pt-10 font-poppins">
      <div className="grow h-96 w-10 bg-white rounded-3xl text-center font-semibold text-2xl pt-3">
        My content
        <div className="flex flex-col justify-evenly h-full pb-16 pt-5">
          <div className="font-normal py-1">Content 1</div>
          <div className="font-normal py-1">Content 2</div>
          <div className="font-normal py-1">Content 3</div>
          <div className="font-normal py-1">Content 4</div>
        </div>
      </div>
    </div>
  );
}
