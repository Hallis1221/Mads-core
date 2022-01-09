import { authenticated } from "../../../auth";
import Content from "../../../mongodb/models/content";

// This is the resolver for the createContent mutation. It takes in the input and creates a new content with the input as the data.
export async function createContent(_: any, { input }: any) {
  // Check that the password is correct.
  if (!authenticated(input["password"])) return null;

  try {
    input["password"] = undefined;
    // Create the content.
    const content = new Content(input);
    // Save the content.
    const newContent = await content.save();
    // Return the content.
    return newContent;
  } catch (error) {
    // In case of an error, log the error and return null.
    console.error(error);
    return null;
  }
}

// This is the resolver for the updateContent mutation. It takes in the id and the input and updates the content with the matching id with the input as the data.
export async function updateContent(_: any, { id, input }: any) {
  // Check that the password is correct.
  if (!authenticated(input["password"])) return null;

  try {
    input["password"] = undefined;
    // Find the content with the matching id and update it with the input.
    let content = await Content.findByIdAndUpdate(
      id,
      { $set: input },
      { new: true }
    );
    // If the content doesn't exist, throw an error.
    if (!content) throw new Error("Content not found");
    // Return the content.
    return content;
  } catch (error) {
    // In case of an error, log the error and return null.
    console.error(error);
    return null;
  }
}

// This is the resolver for the deleteContent mutation. It takes in the id and the input (for the password) and deletes the content with the matching id.
export async function deleteContent(_: any, { id, input }: any) {
  // Check that the password is correct.
  if (!authenticated(input["password"])) return null;

  try {
    input["password"] = undefined;
    // Find the content with the matching id and delete it.
     await Content.findByIdAndDelete(id);
    // Return a success message.
     return "Content deleted";
  } catch (error) {
    // In case of an error, log the error and return null.
    console.error(error);
  }
}
