import { authenticated } from "../../auth";
import ContentData from "../../models/contentData";

export async function createContentData(_: any, { input }: any) {
  if (process.env.NODE_ENV === "production" && !authenticated) return null;

  try {
    const contentData = new ContentData(input);
    const newContentData = await contentData.save();

    return newContentData;
  } catch (error) {
    console.error(error);
  }
}

export async function updateContentData(_: any, { contentID, input }: any) {
  if (process.env.NODE_ENV === "production" && !authenticated) return null;

  try {
    let contentData = (await ContentData.find((contentData: any) => contentData?.contentID === contentID).clone())[0];

    if (!contentData) {
      throw new Error("ContentData not found");
    }
    contentData = await ContentData.findOneAndUpdate(
      { contentID: contentID },
      { $set: input },
      { new: true }
    );

    return contentData;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteContentData(_: any, { contentID }: any) {
  if (process.env.NODE_ENV === "production" && !authenticated)  return null;

  try {
    const contentData = await ContentData.findOne({ contentID });
    if (!contentData) {
      throw new Error("ContentData not found");
    }
    await ContentData.findOneAndDelete({ contentID });
    return "ContentData deleted";
  } catch (error) {
    console.error(error);
  }
}
