import { authenticated } from "../../../auth";
import AdDB from "../../../mongodb/models/ad";

// This is the resolver for the createAd mutation. It takes in the input and creates a new ad with the input as the data.
export async function createAd(_: any, { input }: any) {
  // Check that the password is correct.
  if (!authenticated(input["password"])) return null;

  try {
    input["password"] = undefined;
    // Create the ad.
    const ad = new AdDB(input);
    // Save the ad.
    const newAd = await ad.save();
    // Return the ad.
    return newAd;
  } catch (error) {
    // In case of an error, log the error and return null.
    console.error(error);
    return null;
  }
}

// This is the resolver for the updateAd mutation. It takes in the id and the input and updates the ad with the matching id with the input as the data.
export async function updateAd(_: any, { id, input }: any) {
  // Check that the password is correct.
  if (!authenticated(input["password"])) return null;

  try {
    input["password"] = undefined;
    // Find the ad with the matching id and update it with the input.
    let ad = await AdDB.findByIdAndUpdate(id, { $set: input }, { new: true });
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

// This is the resolver for the deleteAd mutation. It takes in the id and the input (for the password) and deletes the ad with the matching id.
export async function deleteAd(_: any, { id, input }: any) {
  // Check that the password is correct.
  if (!authenticated(input["password"])) return null;

  try {
    input["password"] = undefined;
    // Find the ad with the matching id and delete it.
    await AdDB.findByIdAndDelete(id);
    // Return a success message.
    return "Ad deleted";
  } catch (error) {
    // In case of an error, log the error and return null.
    console.error(error);
  }
}
