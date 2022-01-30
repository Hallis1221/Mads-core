import { isAuthorized } from "../../../../../auth/checks";
import AdDB from "../../../../../db/models/ad";
import { Ad } from "../../../../../types/ad";

// This is the resolver for the createAd mutation. It takes in an ad object and creates a new ad with the ad object.
export default async function createAdMutation(
  _: undefined,
  { ad, apiKey }: { ad: Ad; apiKey: string }
): Promise<Ad> {
  // Check if the apiKey is valid
  if (await isAuthorized("admin", apiKey, undefined)) {
    const addb = new AdDB(ad);
    const newad = await addb.save();
    return newad;
  } else {
    throw new Error("User is not authorized to create an ad");
  }
}

// This is the resolver for the updateAd mutation. It takes in an ad object and updates the ad with the ad object.
export async function updateAdMutation(
  _: undefined,
  { adID, apiKey, ad }: { adID: string; apiKey: string; ad: Ad }
): Promise<Ad> {
  // Check if the apiKey is valid
  if (await isAuthorized("admin", apiKey, undefined)) {
    const newad = await AdDB.findByIdAndUpdate(adID, { $set: ad });

    // If the ad is not found, throw an error
    if (!newad)
      throw new Error(`Ad with id: ${adID} not found, even after update`);

    // Return the ad
    return newad;
  } else {
    throw new Error("User is not authorized to update an ad");
  }
}
