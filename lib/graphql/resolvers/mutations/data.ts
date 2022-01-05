import registerAdClick from "../../../data/registerAdClick";
import registerAdView from "../../../data/registerAdView";
import registerContentClick from "../../../data/registerContentClick";
import registerContentView from "../../../data/registerContentView";

// This is the resolver for the registerViews mutation. It takes in both an adID and contentID and registers the adView and contentView for the adID and contentID.
// This is done to have a single resolver for updating both the adView and contentView.
export async function registerViews(_: any, { adID, contentID }: any) {
  // Register the adView for the adID.
  await registerAdView(adID);
  // Register the contentView for the contentID.
  await registerContentView(contentID);
  // Return true to indicate that the views were registered.
  return true;
}

// This is the resolver for the registerClicks mutation. It takes in both an adID and contentID and registers the adClick and contentClick for the adID and contentID.
// This is done to have a single resolver for updating both the adClick and contentClick.
export async function registerClicks(_: any, { adID, contentID }: any) {
  // Register the adClick for the adID.
  await registerAdClick(adID);
  // Register the contentClick for the contentID.
  await registerContentClick(contentID);
  // Return true to indicate that the clicks were registered.
  return true;
}
