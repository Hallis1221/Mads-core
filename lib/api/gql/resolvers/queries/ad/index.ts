import AdDB from "../../../../../db/models/ad";
import { Ad } from "../../../../../types/ad";

// This is the resolver for the getAd query. It takes in the adID as its only argument and returns the ad with the matching id.
export default async function getAdQuery(
  _: undefined,
  { adID }: { adID: string }
): Promise<Ad> {
  // Find the ad with the matching id
  const ad: Ad | undefined = await AdDB.findOne({ adID });

  // If the ad is not found, throw an error
  if (!ad) throw new Error(`Ad with id: ${adID} not found`);

  // Return the ad
  return ad;
}
