import { isAuthorized } from "../../../../../../auth/checks";
import AdDataDB from "../../../../../../db/models/ad/data";
import { AdData } from "../../../../../../types/data/adData";

// This is the resolver for the createAdData mutation. It takes in adData and creates a new adData with the adData object.
export default async function createAdDataMutation(
  _: undefined,
  { adData, apiKey }: { adData: AdData; apiKey: string }
): Promise<AdData> {
  // Check if the apiKey is valid
  if (await isAuthorized("admin", apiKey, {
    contentid: undefined,
  })) {
    const addb = new AdDataDB(adData);
    const newadData = await addb.save();
    return newadData;
  } else {
    throw new Error("User is not authorized to create an adData");
  }
}

// This is the resolver for the updateAdData mutation. It takes in adData and updates the adData with the adData object.
export async function updateAdDataMutation(
  _: undefined,
  {
    adDataID,
    apiKey,
    adData,
  }: { adDataID: string; apiKey: string; adData: AdData }
): Promise<AdData> {
  // Check if the apiKey is valid
  if (await isAuthorized("admin", apiKey, {
    contentid: undefined,
  })) {
    const newadData = await AdDataDB.findByIdAndUpdate(adDataID, {
      $set: adData,
    });

    // If the adData is not found, throw an error
    if (!newadData)
      throw new Error(
        `AdData with id: ${adDataID} not found, even after update`
      );

    // Return the adData
    return newadData;
  } else {
    throw new Error("User is not authorized to update an adData");
  }
}