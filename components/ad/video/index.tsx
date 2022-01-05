import { ReactElement, useState } from "react";
import toast from "react-hot-toast";
import ReactPlayer from "react-player";
import { registerClick } from "../../../lib/logic/requests/frontend";

export default function VideoAd({ ad, content, setIsDone }: any): ReactElement {
  // Define state for whether the video is paused or not
  let [paused, setPaused] = useState(false);
  // Define state for whether the video is muted or not
  let [muted, setMuted] = useState(true);

  // Define variable for if the video has started playing
  let startedPlayer = false;
  // Define variable for toastID. Used to prevent multiple toasts from being displayed and to close the toast
  let toastId: string | undefined;
  // Define variable for loadingtoastID. Used to prevent multiple loading toasts from being displayed and to close the toast
  let loadingtoastId: string | undefined;
  // Calculate how much of the video the user has to watch before the ad can be skipped
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
      <div className="relative float-right w-[400px] pt-[56.25%] xl:w-[1200px] lg:w-[900px] md:w-[600px]">
        <ReactPlayer
          className="absolute top-0 right-0 justify-center"
          url={ad.video}
          playing={!paused}
          muted={muted}
          width="100%"
          height="100%"
          onPlay={() => {
            setPaused(false);
          }}
          onBuffer={() => {
            if (!startedPlayer) {
              loadingtoastId = toast.loading("Loading video...", {
                duration: 100,
              });
            }
          }}
          onError={() => {
            toast.error("Error loading video");
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
          onReady={() => {
            // Attempt to unmute the video, it is muted by default to enable autoplay on some browsers
            setMuted(false);
            // Wrapped in a timeout to allow the video to load before sending a warning
            setTimeout(() => {
              // If the video has not started playing, send a warning that we were unable to autoplay
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
        />
      </div>
    </>
  );
}
