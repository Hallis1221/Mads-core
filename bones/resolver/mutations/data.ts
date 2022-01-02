import registerAdClick from "../../data/registerAdClick";
import registerAdView from "../../data/registerAdView";
import registerContentClick from "../../data/registerContentClick";
import registerContentView from "../../data/registerContentView";

export async function registerViews(_: any, { adID, contentID }: any) {
    registerAdView(adID);
    registerContentView(contentID);

    return true;
  }

  export async function registerClicks(_: any, { adID, contentID }: any) {
    registerAdClick(adID);
    registerContentClick(contentID);
    return true;
  }
  