import { authenticated } from "../../../auth";
import registerContentView from "../../../data/registerContentView";
import Content from "../../../models/content";

// This is the resolver for the getContent query. It takes in the id and returns the content with the matching id.
export async function getContent(_: any, { id }: any) {
  try {
    // Find the content with the matching id.
    const content = await Content.findById(id).catch((error) => {
      // In case of an error, log the error and return null.
      return null;
    });
    // If the content doesn't exist, throw an error.
    if (!content) 
      throw new Error("Content with id " + id + " not found");

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
