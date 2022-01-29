import { SetStateAction } from "react";
import Countdown from "react-countdown";
import { registerSkip } from "../../leglib/logic/requests/frontend";

export default function ReactiveCountdown({
  isDone,
  content,
  ad,
  setIsDone,
}: {
  isDone: boolean;
  content: any;
  ad: any;
  setIsDone: { (value: SetStateAction<boolean>): void; (arg0: boolean): void };
}) {
  return (
    <Countdown
      date={Date.now() + 15000}
      precision={1}
      intervalDelay={1000}
      className=""
      renderer={(props) => {
        if (isDone)
          return (
            <a href={content.link} onClick={()=>{
              registerSkip(ad.id, content.id)
            }} className="text-xl font-bold ">
              Skip
            </a>
          );
        if (ad.type === "video" && !isDone)
          return <a className="text-xl font-bold ">Waiting...</a>;
        if (props.api.isCompleted()) {
          setIsDone(true);
        }

        if (props.seconds > 0)
          return (
            <a
              className="text-xl font-bold"
              onClick={() => {
                console.log("Hi");
              }}
            >
              {props.seconds}
            </a>
          );

        if (isDone)
          return (
            <a href={content.link} className="text-xl font-bold ">
              Skip
            </a>
          );
        return <a className="text-xl font-bold ">Loading...</a>;
      }}
    />
  );
}
