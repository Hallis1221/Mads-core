import { ReactElement, useState } from "react";
import Image from "next/image";
import ReactPlayer from "react-player/lazy";
import toast from "react-hot-toast";
import { registerClick } from "../../lib/requests/frontend";

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
          priority={true}
          height={630 * 1.2}
          width={1200 * 1.2}
          layout="intrinsic"
          className="h-full hover:cursor-pointer"
          onClick={async () => {
          registerClick(ad.id, content.id)
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
          className="text-xl font-bold font-sans text-white absolute z-10 text-shadow-lg pl-4 bottom-20 md:text-2xl lg:text-3xl xl:text-4xl lg:pl-4 lg:bottom-20 xl:bottom-[4.75rem] md:bottom-20 hover:cursor-pointer"
          onClick={() => {
            if (startedPlayer) {
              registerClick(ad.id, content.id);
              console.log("clicked");
              setPaused(false);
              window.open(ad.link, "_blank");
            }
          }}
        >
          Visit advertiser
        </button>
        <div className="relative float-left w-[400px] pt-[56.25%] xl:w-[1200px] lg:w-[900px] md:w-[600px]">
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
                loadingtoastId = toast.loading("Loading video...", {"duration": 100});
              }
            }}
            onBufferEnd={() => {
              if (loadingtoastId) {
                toast.dismiss(loadingtoastId);
              }
            }}
            onProgress={(progress) => {
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
              // Attempt to unmute the video, it is muted by default to enable autoplay on some browsers
              setMuted(false);
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
