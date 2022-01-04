import { authenticated } from "../../../auth";
import AdData from "../../../models/adData";

export async function createAdData(_: any, { input }: any) {
  if (!authenticated(input["password"])) return null;

  try {
    const adData = new AdData(input);
    const newAdData = await adData.save();

    return newAdData;
  } catch (error) {
    console.error(error);
  }
}

export async function updateAdDataLimits(_: any, { id, input }: any) {
  if (!authenticated(input["password"])) return null;

  try {
    let ad = await AdData.findOne({ adID: id });
    if (!ad) {
      throw new Error("AdData not found");
    }
    ad = await AdData.findOneAndUpdate(
      { adID: id },
      { $set: input },
      { new: true }
    );

    return ad;
  } catch (error) {
    console.error(error);
  }
}

export async function updateAdData(_: any, { adID, input }: any) {
  if (!authenticated(input["password"])) return null;

  try {
    let adData = await AdData.findOne({ adID: adID });
    if (!adData ) {
     return null;
    }
    adData = await AdData.findOneAndUpdate(
      { adID: adID },
      { $set: input },
      { new: true }
    );
    return adData;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteAdData(_: any, { adID,input }: any, ) {
  if (!authenticated(input["password"]))  return null;

  try {
    const adData = await AdData.findOne({ adID });
    if (!adData) {
      throw new Error("AdData not found");
    }
    await AdData.findOneAndDelete({ adID });
    return "AdData deleted";
  } catch (error) {
    console.error(error);
  }
}
