import Image from "next/image";
import { ReactElement } from "react";
import { registerClick } from "../../../lib/logic/requests/frontend";

export default function ImageAd({ad , content}: any): ReactElement {

    return <div>
      <Image
        src={ad.image}
        alt="Deploy"
        priority={true}
        height={630 * 1.2}
        width={1200 * 1.2}
        layout="intrinsic"
        className="h-full hover:cursor-pointer"
        onClick={async () => {
          registerClick(ad.id, content.id);
          window.open(ad.link, "_blank");
        } } />
    </div>;
  }