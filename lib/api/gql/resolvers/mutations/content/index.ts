import { isAuthorized } from "../../../../../auth/checks";
import { permittedToCreateContent } from "../../../../../auth/checks/content";
import ContentDB from "../../../../../db/models/content";
import { Content } from "../../../../../types/content";
import { User } from "../../../../../types/user";

// This is the resolver for the createContent mutation.  It takes in an content object and creates a new ad with the ad object.
export default async function createContentMutation(
  _: any,
  {
    content,
    apiKey,
  }: {
    content: {
      title: string;
      link: string;
      tags: string[];
    };
    apiKey: string;
  },
  { user }: { user: User }
): Promise<Content> {
  // Check if the apiKey is valid
  if (
    (await isAuthorized("admin", apiKey, undefined)) ||
    (await permittedToCreateContent(user))
  ) {
    const addb = new ContentDB(content);
    const newcontent = await addb.save();
    return newcontent;
  } else {
    throw new Error("User is not authorized to create an content");
  }
}

// This is the resolver for the updateContent mutation.  It takes in an content object and updates the ad with the ad object.
export async function updateContentMutation(
  _: any,
  {
    contentID,
    apiKey,
    content,
  }: { contentID: string; apiKey: string; content: Content }
): Promise<Content> {
  // Check if the apiKey is valid
  if (await isAuthorized("admin", apiKey, undefined)) {
    const newcontent = await ContentDB.findByIdAndUpdate(contentID, {
      $set: content,
    });

    // If the content is not found, throw an error
    if (!newcontent)
      throw new Error(
        `Content with id: ${contentID} not found, even after update`
      );

    // Return the content
    return newcontent;
  } else {
    throw new Error("User is not authorized to update an content");
  }
}
