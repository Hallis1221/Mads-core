import registerAdView from "../../data/registerAdView";
import registerContentView from "../../data/registerContentView";

export async function registerViews(_: any, { adID, contentID }: any) {
    registerAdView(adID);
    registerContentView(contentID);

    return true;
  }
  