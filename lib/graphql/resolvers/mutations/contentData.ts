import { authenticated } from "../../../auth";
import ContentData from "../../../models/contentData";

export async function createContentData(_: any, { input }: any) {
  if (!authenticated(input["password"])) return null;

  try {
    const contentData = new ContentData(input);
    const newContentData = await contentData.save();

    return newContentData;
  } catch (error) {
    console.error(error);
  }
}

export async function updateContentData(_: any, { contentID, input }: any) {
  if (!authenticated(input["password"])) return null;

  try {
    let contentData = await ContentData.findOne({ contentID: contentID });
    if (!contentData) {
      return null;
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

export async function deleteContentData(_: any, { contentID, input }: any) {
  if (!authenticated(input["password"])) return null;

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
