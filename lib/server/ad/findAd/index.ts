import { minimumAdsToRace } from "../../../config/ads";
import AdDB from "../../../db/models/ad";
import AdDataDB from "../../../db/models/ad/data";
import { createIntervalTimePair } from "../../../interval";
import { logger } from "../../../log";
import { Ad } from "../../../types/ad";
import addAdDataMatch from "../addAdMatch";

// The matchWithAd function takes in an Content object and matches it with an Ad object.
export async function matchWithAd(
  tags: String[],
  theme: String,
  id: string
): Promise<Ad> {
  // Get all the ads
  const ads: Array<Ad> = await AdDB.find({});

  // If there are no ads, throw an error
  if (!ads.length) throw new Error("No ads found");

  // Return the first ad if we have too few ads to iterate through
  if (ads.length <= minimumAdsToRace) return ads[0];

  // Initialize an array for all the ads we might want to return as an empty array
  let potentialAds: Array<Ad> = [];

  // Narrow down the list of ads to only those that match the content theme
  for (const ad of ads) if (ad.theme === theme) potentialAds.push(ad);

  // Return a random ad if we do not have any ads that match the content theme.
  // Console log that we did not find any ads that match the content theme.
  if (potentialAds.length <= minimumAdsToRace) {
    logger.warn(`No ads found for theme: ${theme}`);
    return ads[Math.floor(Math.random() * ads.length)];
  }

  // Save all the content tags in an array with lowercase letters
  const contentTags: Array<string> = tags.map((tag) => tag.toLowerCase());
  // Sort the list of potential ads by their relevance, according to their tags and tag priorites

  // Initialize a winnder variable for the ad we want to return
  let winner: {
    score: number;
    ad: Ad;
  } = {
    score: 0,
    ad: potentialAds[0],
  };

  // Iterate through the potential ads
  for (const ad of potentialAds) {
    // Initialize a score variable for the ad
    let score: number = 0;

    // Iterate through the ad's tags
    // If the tag is in contentTags, add its priority to the score
    for (const tag of ad.tags)
      if (contentTags.includes(tag.tag)) score += tag.priority;

    // Create a random number between 0 and 5 and add it to the ad relevance. This will make the ad more random and ensure that the ad is not always the same on the same content.
    // (Unless you have a very high priority tag, in which case it will be more likely to be the ad that is returned or you have a very specific theme, in which case it will be more likely to be the ad that is returned)
try {
    score += Math.floor(Math.random() * 5);
    // Get the number of views for the ad
    const views: number = (
      await AdDataDB.findOne({ adID: ad._id })
    ).views;

    // Get the number of clicks for the ad
    const clicks: number = (
      await AdDataDB.findOne({ adID: ad._id }).select("clicks")
    ).clicks;

    // Log some statistics about the ad;
    logger.debug(
      `Checking ad: ${ad.title} with score: ${score}, views: ${views}, clicks: ${clicks}, maxViews: ${ad.maxViews}, maxClicks: ${ad.maxClicks}`
    );

    // if the ad relevance is greater than the current winner's relevance, replace the winner
    if (views < ad.maxViews && clicks < ad.maxClicks) {
      if (score > winner.score) winner = { score, ad };
    } else {
      // Log that the ad is not a winner because it has reached its max views or clicks
      logger.warn(
        `Ad: ${ad.title} is not a winner because it has reached its max views or clicks`
      )
    }} catch (error) {
      logger.error(`Error with ad: ${ad.title}. Most likely the addata is not created yet. Creating it now.`)
      await AdDataDB.create({
        adID: ad._id,
        views: 0,
        clicks: 0,
      });
      
      continue;
    }
  }

  // Return the winnder ad (The ad with the highest score)

  // Create a datepair for usage in the match database
  const datePair: {
    begins: Date;
    ends: Date;
  } = createIntervalTimePair();

  // Create the match object
  const match: {
    contentID: string;
    begins: Date;
    ends: Date;
  } = {
    contentID: id,
    begins: datePair.begins,
    ends: datePair.ends,
  };

  // Add the match to the ads ad data
  let winnerid = await addAdDataMatch(winner.ad, match);
  logger.debug(`Winner data: ${winnerid}`);
  // Check that the winnerid is equal to the ad's id
  if (winnerid !== winner.ad._id.toString())
    winner.ad = await AdDB.findById(winnerid).then((ad) => {
      logger.warn("Overwrote ad winner beacuse addAdDataMatch failed. New ad:   " + winner);
      return ad;
    });

  // Log that we found a match
  logger.info(
    `Found a match for content: ${id}. It matched with ad: ${winner.ad.title}`
  );

  // Return the winnder ad
  return winner.ad;
}
