import AdData from "../../models/adData";

export async function getAdsData() {
  try {
    const adData = await AdData.find({});
    return adData;
  } catch (error) {
    console.error(error);
  }
}

export async function getAdData(_: any, { adID }: any) {
  const adData = (await AdData.find((adData: any) => adData?.adID === adID).clone())[0];
  if (!adData) {
    throw new Error("Data not found");
  }
  return adData;
}
