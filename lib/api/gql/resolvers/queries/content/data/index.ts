import { isAuthorized } from "../../../../../../auth/checks";
import ContentDataDB from "../../../../../../db/models/content/data";
import { ContentData } from "../../../../../../types/data/contentData";
import { User } from "../../../../../../types/user";

// This is the resolver for the getContentData query. It takes in the contentID and returns the contentData with the matching contentID.
export async function getContentDataQuery(
  _: any,
  { contentID }: { contentID: string },
  { user }: { user: User }
): Promise<ContentData> {
  if (await isAuthorized("none", user, { contentid: contentID })) {
    let contentData = await ContentDataDB.findOne({ contentID });

    if (!contentData) throw new Error("Content data not found");

    return contentData;
  } else {
    throw new Error("User is not authorized to get content data");
  }
}
