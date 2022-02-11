import AdDataDB from "../../../db/models/ad/data";
import ContentDB from "../../../db/models/content";
import { logger } from "../../../log";
import { Ad } from "../../../types/ad";
import { Content } from "../../../types/content";
import { AdData } from "../../../types/data/adData";
import { AdMAtch } from "../../../types/match";

// The resolver for the addAdDataMatch mutation. It takes in the Ad as its only argument and returns the updated AdData.
export default async function addAdDataMatch(
  ad: Ad,
  adMatch: AdMAtch
): Promise<String> {
  // Instead of checking the validity of the input all at once we do it in several steps to give a more detailed error message.

  // Find the adData with the matching adID
  let adData: AdData = await AdDataDB.findOne({ adID: ad._id });

  // If the ad data is not found, throw an error
  if (!adData) throw new Error(`Ad data with adID: ${ad._id} not found`);

  // Check if the adData has a match with the matching contentID, begins data and ends data.

  const exsists = adData.matches.find((match: AdMAtch) => {
    // Get match dates as numbers
    let matchBegins: number = new Date(match.begins).getTime();
    let matchEnds: number = new Date(match.ends).getTime();

    // Get ad dates as numbers
    let adBegins: number = adMatch.begins.getTime();
    let adEnds: number = adMatch.ends.getTime();

    // If all the inputs match, return true
    if (
      match.contentID === adMatch.contentID &&
      matchBegins === adBegins &&
      matchEnds === adEnds
    )
      return true;
  });

  // If the match already exists, throw an error
  if (exsists) {
    // Get the existing match adData
    logger.warn(
      `Match already exists for adID: ${ad._id} and contentID: ${adMatch.contentID}`
    );
    return (await AdDataDB.findOne({ adID: adData.adID, contentID: adMatch.contentID }).select("adID")).adID;
  }


// DISABELED TEMP
/*
  // Check if theres already a match beginning at the same time as the new match
  const beginDateOccupied = adData.matches.find((match: AdMAtch) => {
    // Get match begins as numbers
    let matchBegins: number = new Date(match.begins).getTime();

    // Get ad begins as numbers
    let adBegins: number = adMatch.begins.getTime();

    // If the begins are the same, return true
    if (matchBegins === adBegins) {
      return true;
    }
  });

  // If the begins are occupied, throw an error
  if (beginDateOccupied) {
    logger.warn(
      `Match begins at the same time as another match for adID: ${ad._id} and contentID: ${adMatch.contentID}`
    );
    return (await AdDataDB.findOne({
      adID: adData.adID,
      matches: { $elemMatch: { contentID: adMatch.contentID } },
    }).select("adID")).adID;
  }
*/
  // Check if theres as ad that is starting after the new match
  const altersTime = adData.matches.find((match: AdMAtch) => {
    // Get match begins as a number
    let matchBegins: number = new Date(match.begins).getTime();

    // Get ad begins as a number
    let adBegins: number = adMatch.begins.getTime();

    // If the matchBegins is bigger than the adBegins, return true
    if (matchBegins > adBegins) return true;
  });

  // If the ad is starting after the new match, throw an error
  if (altersTime)
    throw new Error(
      `A match starts after the new match. You may not alter time. Your ad match begins was: ${adMatch.begins}`
    );

  // Check if the contentID is valid
  const content: Content = await ContentDB.findOne({ _id: adMatch.contentID });

  // If the content is not found, throw an error
  if (!content)
    throw new Error(`Content with contentID: ${adMatch.contentID} not found`);

  // Cgeck that the new match begins is before the new match ends
  if (adMatch.begins > adMatch.ends)
    throw new Error(
      `New match begins is after the new match ends. Your new match begins was: ${adMatch.begins} and your new match ends was: ${adMatch.ends}`
    );

  // Check if the time span between the new input begins and ends is valid. It is valid if it is less than or equal to a day.
  const timeSpan: number = adMatch.ends.getTime() - adMatch.begins.getTime();
  const timeSpanInDays: number = timeSpan / (1000 * 60 * 60 * 24);

  if (timeSpanInDays > 1)
    throw new Error(
      `The time span between the new match begins and ends is more than a day. Your new match begins was: ${adMatch.begins} and your new match ends was: ${adMatch.ends}`
    );

  // Add the match to the adData
  adData.matches.push(adMatch);

  // Save the adData
  adData = await AdDataDB.findOneAndUpdate(
    { adID: adData.adID },
    { $set: { matches: adData.matches } }
  );

  // Return the adData
  return adData.adID;
}
