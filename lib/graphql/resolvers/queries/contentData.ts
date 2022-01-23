import { authenticated } from "../../../auth";
import getOwner from "../../../data/owns";
import ContentData from "../../../mongodb/models/contentData";

// This is the resolver for the getContentData query. It takes in the contentID and returns the contentData with the matching contentID.
export async function getContentData(_: any, { contentID, password }: any, { user }: any) {
  // Check that the user is authenticated. 
  // TODO
  if (
    ((password && authenticated(password) && contentID) ||
      (user && user.uid && (await getOwner(contentID)).uid === user.uid)) ===
    false
  )
    throw new Error("Unauthorized");
  try {
    // Find the contentData with the matching contentID.
    const contentData = await ContentData.findOne({ contentID });
    // If the contentData doesn't exist, throw an error.
    if (!contentData) throw new Error("ContentData not found");
    // Return the contentData.
    return contentData;
  } catch (error) {
    // In case of an error, log the error and return null.
    console.error(error);
    return null;
  }
}
