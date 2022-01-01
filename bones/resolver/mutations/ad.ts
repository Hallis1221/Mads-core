import { authenticated } from "../../auth";
import Ad from "../../models/ad";

export async function createAd(_: any, { input }: any) {
  if (process.env.NODE_ENV === "production" && !authenticated) 
    return null;
  
  try {
    const ad = new Ad(input);
    const newAd = await ad.save();

    return newAd;
  } catch (error) {
    console.error(error);
  }
}

export async function updateAd(_: any, { id, input }: any) {
  if (process.env.NODE_ENV === "production" && !authenticated) return null;

  try {
    let ad = await Ad.findById(id);
    if (!ad) {
      throw new Error("Ad not found");
    }
    ad = await Ad.findByIdAndUpdate(id, { $set: input }, { new: true });

    return ad;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteAd(_: any, { id }: any) {
  if (process.env.NODE_ENV === "production" && !authenticated) 

  try {
    const ad = await Ad.findById(id);
    if (!ad) {
      throw new Error("Ad not found");
    }
    await Ad.findByIdAndDelete(id);
    return "Ad deleted";
  } catch (error) {
    console.error(error);
  }
}
