// This is the resolver for the registerViews mutation. It takes in both an adID and contentID and registers the adView and contentView for the adID and contentID.
// This is done to have a single resolver for updating both the adView and contentView.

import registerAdView from "../../../../../statistics/register/ad/view";
import registerContentView from "../../../../../statistics/register/content/view";

export async function registerViewsMutation(
  _: undefined,
  { adID, contentID }: { adID: string; contentID: string }
): Promise<void> {
        
    await registerAdView(adID);
    
    await registerContentView(contentID);

    return;
}
