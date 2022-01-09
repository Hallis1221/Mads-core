import { authenticated } from "../../../auth";
import AdData from "../../../models/adData";

// This is the resolver for the getAdsData query. It takes in the input (for the password) and returns all addData.
export async function getAdsData(_: any, { input }: any) {
  // Check that the password is correct.
  if (!authenticated(input["password"])) return null;
  try {
    input["password"] = undefined;
    // Find all addData.
    const adData = await AdData.find({});
    // Return all addData.
    return adData;
  } catch (error) {
    // In case of an error, log the error and return null.
    console.error(error);
    return null;
  }
}

// This is the resolver for the getAdData query. It takes in the id and returns the addData with the matching id.
export async function getAdData(_: any, { adID }: any) {
  try {
    // Find the addData with the matching id.
    const adData = await AdData.findOne({ adID });
    // If the addData doesn't exist, throw an error.
    if (!adData) throw new Error("addData not found");
    // Return the addData.
    return adData;
  } catch (error) {
    // In case of an error, log the error and return null.
    console.error(error);
    return null;
  }
}
