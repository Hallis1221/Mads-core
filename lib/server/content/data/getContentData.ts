import ContentDataDB from "../../../db/models/content/data";
import { ContentData } from "../../../types/data/contentData";
import { getUserContent } from "../getContent";

export async function getUserContentData(uid: string) {
  let contents: ContentData[] = [];
  let contentIDS = await getUserContent(uid);

  for (var content of contentIDS) {
    let contentID = content._id;

    let contentData = await ContentDataDB.find({ contentID });
    // TODO might fail
    contents.push(contentData as unknown as ContentData);
  }

  return contents;
}
