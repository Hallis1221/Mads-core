import AdDB from "../../../../lib/db/models/ad";
import { authenticated } from "../../../auth";

// This is the resolver for the getAds query. It takes in the input (for the password) and returns all ads.
export async function getAds(_: any, { input }: any) {
  // Check that the password is correct.
  if (!authenticated(input["password"]))   throw new Error("Unauthorized");
    input["password"] = undefined;
    // Find all ads.
    const ads = await AdDB.find({});

    // If maxClicks or maxViews is not set, set it to the default value.
    ads.forEach((ad: any) => {
      if (!ad.maxClicks) ad.maxClicks = 0;
      if (!ad.maxViews) ad.maxViews = 0;
    });

    
    // Return all ads.
    return ads;

}

// This is the resolver for the getAd query. It takes in the id and returns the ad with the matching id.
export async function getAd(_: any, { id }: any) {
    // Find the ad with the matching id.
    const ad = await AdDB.findById(id);
    // If the ad doesn't exist, throw an error.
    if (!ad) throw new Error("Ad not found");
    // Return the ad.
    return ad;

}
