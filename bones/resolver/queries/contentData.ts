import ContentData from "../../models/contentData";

export async function getContentData(_: any, { contentID }: any) {
  const contentData = (await ContentData.find((contentData: any) => contentData?.contentID === contentID).clone())[0];
  if (!contentData) {
    throw new Error("ContentData not found");
  }
  return contentData;
}
