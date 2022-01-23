import registerAdClick from "../../../data/registerAdClick";
import registerAdSkip from "../../../data/registerAdSkip";
import registerAdView from "../../../data/registerAdView";
import registerContentClick from "../../../data/registerContentClick";
import registerContentSkip from "../../../data/registerContentSkip";
import registerContentView from "../../../data/registerContentView";
import {getGraphQLRateLimiter} from "graphql-rate-limit";

// This is the resolver for the registerViews mutation. It takes in both an adID and contentID and registers the adView and contentView for the adID and contentID.
// This is done to have a single resolver for updating both the adView and contentView.
export async function registerViews(
  parent: any,
  args: any,
  context: any,
  info: any
) {
  const rateLimiter = getGraphQLRateLimiter({
    identifyContext: (ctx) => {
      let headers = ctx.req.socket._httpMessage.req.rawHeaders;
      console.log(headers[headers.length - 1]);
      return headers[headers.length - 1];
    },
  });

  const errorMessage = await rateLimiter(
    { parent, args, context, info },
    { max: 5, window: '10s' }
  );
  if (errorMessage) throw new Error(errorMessage);
  // Register the adView for the adID.
  await registerAdView(args.adID);
  // Register the contentView for the contentID.
  await registerContentView(args.contentID, parent, args, context, info);
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

// This is the resolver for the registerSkips mutation. It takes in both an adID and contentID and registers the adSkip and contentSkip for the adID and contentID.
// This is done to have a single resolver for updating both the adSkip and contentSkip.
export async function registerSkips(_: any, { adID, contentID }: any) {
  // Register the adSkip for the adID.
  await registerAdSkip(adID);
  // Register the contentSkip for the contentID.
  await registerContentSkip(contentID);
  // Return true to indicate that the skips were registered.
  return true;
}
