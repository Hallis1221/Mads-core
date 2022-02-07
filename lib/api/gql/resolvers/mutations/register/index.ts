import { md5 } from "pure-md5";
import { logger } from "../../../../../log";
import {
  isAdRateLimited,
  isContentRateLimited,
} from "../../../../../server/ratelimit";
import registerAdClick from "../../../../../statistics/register/ad/click";
import registerAdSkip from "../../../../../statistics/register/ad/skip";
import registerAdView from "../../../../../statistics/register/ad/view";
import registerContentClick from "../../../../../statistics/register/content/click";
import registerContentSkip from "../../../../../statistics/register/content/skip";
import registerContentView from "../../../../../statistics/register/content/view";

// This is the resolver for the registerViews mutation. It takes in both an adID and contentID and registers the adView and contentView for the adID and contentID.
// This is done to have a single resolver for updating both the adView and contentView.

export async function registerViewsMutation(
  _: undefined,
  { adID, contentID }: { adID: string; contentID: string },
  { ip }: { ip: string }
): Promise<void> {
  let adRateLimited = false;
  let contentRateLimited = false;

  ip = md5(ip);

  // Check if the adID is found in the ratelimiter database
  adRateLimited = await isAdRateLimited(adID, ip, "view");

  // Check if the contentID is found in the ratelimiter database
  contentRateLimited = await isContentRateLimited(
    contentID,
    ip,
    "view"
  );

  if (!adRateLimited) await registerAdView(adID);

  if (!contentRateLimited) await registerContentView(contentID);

  return;
}

// This is the resolver for the registerClicks mutation. It takes in both an adID and contentID and registers the adClick and contentClick for the adID and contentID.
// This is done to have a single resolver for updating both the adClick and contentClick.

export async function registerClicksMutation(
  _: undefined,
  { adID, contentID }: { adID: string; contentID: string },
  { ip }: { ip: string }
): Promise<void> {
  let adRateLimited = false;
  let contentRateLimited = false;

  ip = md5(ip);

  // Check if the adID is found in the ratelimiter database
  adRateLimited = await isAdRateLimited(adID, ip, "click");

  // Check if the contentID is found in the ratelimiter database
  contentRateLimited = await isContentRateLimited(
    contentID,
    ip,
    "click"
  );

  if (!adRateLimited) await registerAdClick(adID);

  if (!contentRateLimited) await registerContentClick(contentID);

  return;
}

// This is the resolver for the registerSkips mutation. It takes in both an adID and contentID and registers the adSkip and contentSkip for the adID and contentID.
// This is done to have a single resolver for updating both the adSkip and contentSkip.

export async function registerSkipsMutation(
  _: undefined,
  { adID, contentID }: { adID: string; contentID: string },
  { ip }: { ip: string }
): Promise<void> {
  let adRateLimited = false;
  let contentRateLimited = false;

  ip = md5(ip);

  // Check if the adID is found in the ratelimiter database
  adRateLimited = await isAdRateLimited(adID, ip, "skip");

  // Check if the contentID is found in the ratelimiter database
  contentRateLimited = await isContentRateLimited(
    contentID,
    ip,
    "skip"
  );

  if (!adRateLimited) await registerAdSkip(adID);

  if (!contentRateLimited) await registerContentSkip(contentID);

  return;
}
