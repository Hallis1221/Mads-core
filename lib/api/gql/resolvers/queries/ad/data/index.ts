import AdDataDB from "../../../../../../db/models/ad/data";
import { AdData } from "../../../../../../types/data/adData";

// This is the resolver for the getAdData query. It takes in the adID as its only argument and returns the adData with the matching adID.
export default async function getAdData(_: undefined, { adID }: { adID: string }): Promise<AdData> {
  // Find the ad data with the matching adID
    const adData: AdData | undefined = await AdDataDB.findOne({ adID });

    // If the ad data is not found, throw an error
    if (!adData) throw new Error(`Ad data with adID: ${adID} not found`);

    // Return the ad data
    return adData;
}