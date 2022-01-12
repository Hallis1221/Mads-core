import { authenticated } from "../../../auth";
import AdDB from "../../../mongodb/models/ad";
import { addAdMatch, getAds } from "../../../logic/requests/backend";
import createIntervaledTime, {
  createIntervaledTimePair,
} from "../../../time/interval";
import { Ad } from "../../../types/ad";

export default async function findAd(_: any, { input }: any) {
  // Check if the password is correct
  if (!authenticated(input["password"])) return null;

  // Get all ads
  const allAds: Array<any> = await getAds(input["password"]);

  // return the first ad we can get if we have too few ads to iterate through
  if (1 >= allAds.length) return AdDB.findOne({});

  // initialize an array for all the ads we might want to return as a empty array
  let potentialAds: Array<any> = [];
  // Narrow down the list of ads to only those that match the input theme
  allAds.forEach((ad: any) => {
    if (ad.theme === input.theme) potentialAds.push(ad);
  });
  // return a random ad if we dont have any with matching theme
  if (potentialAds.length === 0) return AdDB.findOne({});

  // return the first potential ad if we have too few ads to iterate through
  if (1 > potentialAds.length) return potentialAds[0];
  // Sort the list of potential ads by their relevance, according to their tags and their tag priorities
  let winner: { score: number; ad: Ad } = { score: 0, ad: potentialAds[0] };
  // iterate through all the potential ads
  potentialAds.forEach((ad: any) => {
    // initialize a score for the current ad
    let adrelevance = 0;

    // iterate through all the tags of the current ad
    ad.tags.forEach((tag: any) => {
      // if the tag is in the input tags, add its priority to the ad relevance
      if (input.tags.includes(tag.tag)) {
        // add the tag priority to the ad relevance
        adrelevance += tag.priority;
      }
    });

    // Create a random number between 0 and 5 and add it to the ad relevance. This will make the ad more random and ensure that the ad is not always the same on the same content.
    // (Unless you have a very high priority tag, in which case it will be more likely to be the ad that is returned or you have a very specific theme, in which case it will be more likely to be the ad that is returned)
    adrelevance += Math.floor(Math.random() * 5);
    // if the ad relevance is greater than the current winner's relevance, replace the winner
    if (adrelevance > winner.score)
      // replace the winner
      winner = { score: adrelevance, ad: ad };
  });

  // return the winner ad (the ad with the highest relevance)
  let datePair: {
    begins: Date;
    ends: Date;
  } = createIntervaledTimePair();
  let match = {
    contentID: input.contentID,
    begins: datePair.begins,
    ends: datePair.ends,
  };
  addAdMatch(winner.ad.id, input["password"], match).catch((err: Error) => {
    // Will likely throw error in development as it is only configured to be every 30 minutes. Eg createIntervaledTimePair().end will return a date that is 30 minutes from now. This means that within a 30 minute time span we will get the same beginning and end date.
    console.log(err.message);
  });
  return winner.ad;
}
