import { authenticated } from "../../../auth";
import Content from "../../../models/content";

// TODO track which ads are being matched with which content

// This is the resolver for the getContent query. It takes in the id and returns the content with the matching id.
export async function getContent(_: any, { id }: any) {
  try {
    // Find the content with the matching id.
    const content = await Content.findById(id);
    // If the content doesn't exist, throw an error.
    if (!content) {
      console.log("content not found with id: " + id);
      return null;
    }

    // Return the content.
    return content;
  } catch (error) {
    // In case of an error, log the error and return null.
    console.error(error);
    return null;
  }
}

// This is the resolver for the getContents query. It takes in the input (for the password) and returns all contents.
export async function getContents(_: any, { input }: any) {
  // Check that the password is correct.
  if (!authenticated(input["password"])) return null;
  try {
    // Find all contents.
    const contents = await Content.find({});
    // Return all contents.
    return contents;
  } catch (error) {
    // In case of an error, log the error and return null.
    console.error(error);
    return null;
  }
}
