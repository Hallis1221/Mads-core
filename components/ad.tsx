import { ReactElement, useState } from "react";
import Image from "next/image";
import ReactPlayer from "react-player/lazy";
import toast from "react-hot-toast";
import { gql } from "graphql-request";
import { gqc } from "../bones/network/client";

const regClick = gql`
  mutation Mutation($adId: ID!, $contentId: ID!) {
    registerClicks(adID: $adId, contentID: $contentId)
  }
`;
export default function MainAd({ ad, content, setIsDone }: any): ReactElement {
  let [paused, setPaused] = useState(false);
  let [muted, setMuted] = useState(true);

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
          className="rounded-xl h-full hover:cursor-pointer"
          onClick={() => {
            gqc.request(regClick, {
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
    let loadingtoastId: string | undefined;
    let requiredWatchTime =
      (Math.floor(Math.random() * (150 - 125)) + 125 - 100) * 0.01;
    return (
      <>
        <button
          className="text-3xl font-bold font-sans text-white absolute z-10 text-shadow-lg pl-4 lg:pl-4 bottom-24 lg:bottom-20 xl:bottom-20 md:bottom-16 hover:cursor-pointer"
          onClick={() => {
            if (startedPlayer) {
              gqc.request(regClick, {
                adId: ad.id,
                contentId: content.id,
              });
              console.log("clicked");
              setPaused(true);
              window.open(ad.link, "_blank");
            }
          }}
        >
          Visit advertiser
        </button>
        <div className="relative rounded-t-xl w-[400px] pt-[56.25%] xl:w-[1200px] lg:w-[900px] md:w-[600px] overflow-hidden">
          <ReactPlayer
            className="absolute top-0 left-0"
            url={ad.video}
            playing={!paused}
            muted={muted}
            onPlay={() => {
              setPaused(false);
            }}
            onBuffer={() => {
              if (!startedPlayer) {
                loadingtoastId = toast.loading("Loading video...");
              }
            }}
            onBufferEnd={() => {
              if (loadingtoastId) {
                toast.dismiss(loadingtoastId);
              }
            }}
            onProgress={(progress) => {
              // Attempt to unmute the video, it is muted by default to enable autoplay on some browsers
              setMuted(false);
              if (progress.played > 0) startedPlayer = true;
              if (progress.played >= requiredWatchTime) {
                setIsDone(true);
              }
              if (progress.playedSeconds > 0.25) {
                toast.dismiss(toastId);
              }
            }}
            onEnded={() => {
              setIsDone(true);
            }}
            onReady={() => {

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
            config={{
              youtube: {
                playerVars: {
                  autoplay: 1,
                  controls: 0,
                  disablekb: 1,
                  fs: 0,
                  modestbranding: 0,
                  rel: 0,
                  showinfo: 0,
                  playsinline: 0,
                  iv_load_policy: 3,
                  cc_load_policy: 0,
                  cc_lang_pref: "en",
                  autohide: 1,
                },
              },
            }}
            width="100%"
            height="100%"
          />
        </div>
      </>
    );
  }
  return <div>Ad not found</div>;
}
