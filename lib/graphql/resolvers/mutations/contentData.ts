import { authenticated } from "../../../auth";
import ContentData from "../../../models/contentData";

// This is the resolver for the createContentData mutation. It takes in the input and creates a new contentData with the input as the data.
export async function createContentData(_: any, { input }: any) {
  // Check that the password is correct.
  if (!authenticated(input["password"])) return null;

  try {
    input["password"] = undefined;
    // Create the contentData.
    const contentData = new ContentData(input);
    // Save the contentData.
    const newContentData = await contentData.save();

    // Return the contentData.
    return newContentData;
  } catch (error) {
    // In case of an error, log the error and return null.
    console.error(error);
    return null;
  }
}

// This is the resolver for the updateContentData mutation. It takes in the id and the input and updates the contentData with the matching id with the input as the data.
export async function updateContentData(_: any, { contentID, input }: any) {
  // Check that the password is correct.
  if (!authenticated(input["password"])) return null;

  try {
    input["password"] = undefined;
    // Find the contentData with the matching id and update it with the input.
    let contentData =await ContentData.findOneAndUpdate(
      { contentID: contentID },
      { $set: input },
      { new: true }
    );
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

// This is the resolver for the deleteContentData mutation. It takes in the id and the input (for the password) and deletes the contentData with the matching id.
export async function deleteContentData(_: any, { contentID, input }: any) {
  // Check that the password is correct.
  if (!authenticated(input["password"])) return null;

  try {
    input["password"] = undefined;
    // Find the contentData with the matching id and delete it.
    await ContentData.findOneAndDelete({ contentID });
    // Return a success message.
    return "ContentData deleted";
  } catch (error) {
    // In case of an error, log the error and return null.
    console.error(error);
    return null;
  }
}
