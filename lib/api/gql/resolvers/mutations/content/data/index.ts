import { isAuthorized } from "../../../../../../auth/checks";
import ContentDataDB from "../../../../../../db/models/content/data";
import { ContentData } from "../../../../../../types/data/contentData";

// This is the resolver for the createContentData mutation. It takes in the contentData object and creates a new contentData with the contentData object.
export default async function createContentDataMutation(
  _: undefined,
  { contentData, apiKey }: { contentData: ContentData; apiKey: string }
): Promise<ContentData> {
  // Check if the apiKey is valid
  if (
    await isAuthorized("admin", apiKey, {
      contentid: undefined,
    })
  ) {
    const contentdb = new ContentDataDB(contentData);
    const newcontentData = await contentdb.save();
    return newcontentData;
  } else {
    throw new Error("User is not authorized to create an contentData");
  }
}

// This is the resolver for the updateContentData mutation. It takes in the contentData object and updates the contentData with the contentData object.
export async function updateContentDataMutation(
  _: undefined,
  {
    contentDataID,
    apiKey,
    contentData,
  }: { contentDataID: string; apiKey: string; contentData: ContentData }
): Promise<ContentData> {
  // Check if the apiKey is valid
  if (
    await isAuthorized("admin", apiKey, {
      contentid: undefined,
    })
  ) {
    const newcontentData = await ContentDataDB.findByIdAndUpdate(
      contentDataID,
      { $set: contentData }
    );

    // If the contentData is not found, throw an error
    if (!newcontentData)
      throw new Error(
        `ContentData with id: ${contentDataID} not found, even after update`
      );

    // Return the contentData
    return newcontentData;
  } else {
    throw new Error("User is not authorized to update an contentData");
  }
}
