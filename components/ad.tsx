import { ReactElement, useState } from "react";
import Image from "next/image";
import ReactPlayer from "react-player/lazy";
import toast from "react-hot-toast";
import { gql } from "graphql-request";
import { client } from "../bones/network";

const regClick= gql`
  mutation Mutation($adId: ID!, $contentId: ID!) {
    registerClicks(adID: $adId, contentID: $contentId)
  }
`;
export default function MainAd({ ad, content, setIsDone }: any): ReactElement {
  if (!ad) return <div>Ad not found</div>;
  if (
    ad.type === "image" ||
    (ad.image !== "" &&
      ad.image !== null &&
      ad.image !== undefined &&
      ad.type !== "video")
  )
    return (
      <div>
        <Image
          src={ad.image}
          alt="Deploy"
          height={630 * 1.2}
          width={1200 * 1.2}
          layout="intrinsic"
          className="rounded-xl h-full"
          onClick={() => {
            client.request(regClick, {
              adId: ad.id,
              contentId: content.id,
            });
            window.open(ad.link, "_blank");

          }}
        />
      </div>
    );
  if (ad.video !== "" && ad.video !== null && ad.video !== undefined) {
    let startedPlayer = false;
    let toastId: string | undefined;
    let requiredWatchTime =
      (Math.floor(Math.random() * (200 - 125)) + 125 - 100) * 0.01;
    return (
      <div className="relative pt-[56.25%] xl:w-[1200px] lg:w-[900px] md:w-[600px]">
        <ReactPlayer
          url={ad.video}
          className="absolute top-0 left-0"
          onPause={() => {
            if (startedPlayer) {
              client.request(regClick, {
                adId: ad.id,
                contentId: content.id,
              });
              window.open(ad.link, "_blank");
            }
          }}
          onProgress={(progress) => {
            if (progress.played > 0) startedPlayer = true;
            if (progress.played >= requiredWatchTime) {
              setIsDone(true);
            }
            if (progress.playedSeconds > 0.25) toast.dismiss(toastId);
          }}
          onEnded={() => {
            setIsDone(true);
          }}
          onReady={() => {
            console.log("ready");
            setTimeout(() => {
              if (!startedPlayer)
                toastId = toast(
                  "Unable to auto play. Please click the play button",
                  {
                    duration: 40000,
                    position: "top-center",
                    // Styling
                    style: {},
                    className: "warn",
                    // Custom Icon
                    icon: "⚠️",
                    // Change colors of success/error/loading icon
                    iconTheme: {
                      primary: "#000",
                      secondary: "#fff",
                    },
                    // Aria
                    ariaProps: {
                      role: "status",
                      "aria-live": "polite",
                    },
                  }
                );
            }, 1000);
          }}
          onError={() => {
            toast.error("Error loading video");
          }}
          muted={false}
          config={{
            youtube: {
              playerVars: {
                autoplay: 1,
                controls: 0,
                disablekb: 1,
                fs: 0,
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
                playsinline: 0,
              },
            },
          }}
          width="100%"
          height="100%"
        />
      </div>
    );
  }
  return <div>Ad not found</div>;
}
