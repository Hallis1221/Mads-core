import { ReactElement } from "react";
import ImageAd from "./image";
import VideoAd from "./video";

export default function MainAd({ ad, content, setIsDone }: any): ReactElement {
  // If the ad is undefined, return nothing
  if (!ad) return <div>Ad not found</div>;

  // If the type is set explicitly, use that
  if (ad.type) {
    if (ad.type === "video") return <VideoAd ad={ad} content={content} setIsDone={setIsDone} />;
    if (ad.type === "image") return <ImageAd ad={ad} content={content} setIsDone={setIsDone} />;
  }

  // if the type is not set, return image if the image value is set
  if (ad?.image) return <ImageAd ad={ad} content={content} setIsDone={setIsDone} />;
  // if the type is not set, return video if the video value is set and the image value is not set
  if (ad.video) return <VideoAd ad={ad} content={content} setIsDone={setIsDone} />;

  // if the type is not set, a not found error is returned
  return <div>Ad not found</div>;
}
