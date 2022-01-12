import { authenticated } from "../../../auth";
import AdDB from "../../../mongodb/models/ad";

// This is the resolver for the getAds query. It takes in the input (for the password) and returns all ads.
export async function getAds(_: any, { input }: any) {
  // Check that the password is correct.
  if (!authenticated(input["password"])) return null;
  try {
    input["password"] = undefined;
    // Find all ads.
    const ads = await AdDB.find({});
    // Return all ads.
    return ads;
  } catch (error) {
    // In case of an error, log the error and return null.
    console.error(error);
    return null;
  }
}

// This is the resolver for the getAd query. It takes in the id and returns the ad with the matching id.
export async function getAd(_: any, { id }: any) {
  try {
    // Find the ad with the matching id.
    const ad = await AdDB.findById(id);
    // If the ad doesn't exist, throw an error.
    if (!ad) throw new Error("Ad not found");
    // Return the ad.
    return ad;
  } catch (error) {
    // In case of an error, log the error and return null.
    console.error(error);
    return null;
  }
}
