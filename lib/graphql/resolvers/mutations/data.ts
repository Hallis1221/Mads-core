import registerAdClick from "../../../data/registerAdClick";
import registerAdSkip from "../../../data/registerAdSkip";
import registerAdView from "../../../data/registerAdView";
import registerContentClick from "../../../data/registerContentClick";
import registerContentSkip from "../../../data/registerContentSkip";
import registerContentView from "../../../data/registerContentView";
import { getGraphQLRateLimiter } from "graphql-rate-limit";
import { ApolloError } from "apollo-server-core";

// This is the resolver for the registerViews mutation. It takes in both an adID and contentID and registers the adView and contentView for the adID and contentID.
// This is done to have a single resolver for updating both the adView and contentView.
export async function registerViews(
  parent: any,
  args: any,
  context: any,
  info: any
) {
  const rateLimiter = getGraphQLRateLimiter({
    identifyContext: (context) => {
      try {
        if (context.user && context.user.user.email)
        return context.user.user.email;
      else if (context.req.headers["x-forwarded-for"])
        return context.req.headers["x-forwarded-for"];
      else if (context.req.headers["x-real-ip"])
        return context.req.headers["x-real-ip"];
      else if (context.req.headers.cookie) return context.req.headers.cookie;
      else if (context.req.ip) return context.req.ip;

      console.error("Failed to identify user at rate limiter. Using cookie");
      return context.req.headers.cookie;
      } catch (error) {
        console.error(error, context);
        throw error;
      }
     
    },
    enableBatchRequestCache: true,
  });

  // !! Not sure if this is working.

  let error = await rateLimiter(
    { parent, args, context, info },
    { max: 3, window: "10000", message: "Too many requests" }
  );

  if (error) throw new Error(error);
  // Register the adView for the adID.
  await registerAdView(args.adID);
  // Register the contentView for the contentID.
  await registerContentView(args.contentID);
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
