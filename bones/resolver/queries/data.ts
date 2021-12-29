import AdData from "../../models/data";

export async function getData() {
  try {
    const data = await AdData.find({});
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function getAdData(_: any, { adID }: any) {
  const data = (await AdData.find((data: any) => data?.adID === adID).clone())[0];
  if (!data) {
    throw new Error("Data not found");
  }
  return data;
}
