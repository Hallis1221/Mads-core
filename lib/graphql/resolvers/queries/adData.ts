import AdData from "../../../models/adData";

export async function getAdsData() {
  try {
    const adData = await AdData.find({});
    return adData;
  } catch (error) {
    console.error(error);
  }
}

export async function getAdData(_: any, { adID }: any) {
  const adData = (await AdData.findOne({ adID }))
  if (!adData) 
  return null;
  
  return adData;
}
