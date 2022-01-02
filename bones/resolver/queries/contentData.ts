import ContentData from "../../models/contentData";

export async function getContentData(_: any, { contentID }: any) {
  const contentData = (await ContentData.findOne({ contentID }))
  if (!contentData) {
    throw new Error("ContentData not found");
  }
  return contentData;
}
