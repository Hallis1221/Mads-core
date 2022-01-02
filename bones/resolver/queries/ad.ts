import { authenticated } from "../../auth";
import registerView from "../../data/registerAdView";
import Ad from "../../models/ad";

export async function getAds(_ : any, { input } : any) {
  if (!authenticated(input["password"])) return null;
  try {
    const ads = await Ad.find({});
    return ads;
  } catch (error) {
    console.error(error);
  }
}

export async function getAd(_: any, { id }: any) {
  const ad = await Ad.findById(id);
  if (!ad) {
    throw new Error("Ad not found");
  }else {
    registerView(id);
  }
  return ad;
}
