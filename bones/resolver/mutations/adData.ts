import { authenticated } from "../../auth";
import AdData from "../../models/adData";

export async function createAdData(_: any, { input }: any) {
  if (process.env.NODE_ENV === "production" && !authenticated) return null;

  try {
    const adData = new AdData(input);
    const newAdData = await adData.save();

    return newAdData;
  } catch (error) {
    console.error(error);
  }
}

export async function updateAdDataLimits(_: any, { id, input }: any) {
  if (process.env.NODE_ENV === "production" && !authenticated) return null;

  try {
    let ad = await AdData.findOne({ adID: id });
    if (!ad) {
      throw new Error("Data not found");
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
  if (process.env.NODE_ENV === "production" && !!authenticated) return null;

  try {
    let adData = (await AdData.find((adData: any) => adData?.adID === adID).clone())[0];

    if (!adData) {
      throw new Error("Data not found");
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

export async function deleteAdData(_: any, { id }: any) {
  if (process.env.NODE_ENV === "production" && !!authenticated)  return null;

  try {
    const adData = await AdData.findOne({ adID: id });
    if (!adData) {
      throw new Error("Data not found");
    }
    await AdData.findOneAndDelete({ adID: id });
    return "Data deleted";
  } catch (error) {
    console.error(error);
  }
}
