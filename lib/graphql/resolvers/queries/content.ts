import { authenticated } from "../../../auth";
import Content from "../../../mongodb/models/content";
import User from "../../../mongodb/models/user";

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
    input["password"] = undefined;
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

// This is the resolver for the getUserContent query. It takes in the user or userID and returns all the contents linked to the user.
export async function getUserContent(
  _: any,
  { password, userID, userId }: any,
  { req, user }: any
) {
  // Check that the user is authenticated.
  if ((!authenticated(password) || !userID) && !user) return null;
  try {
    password = undefined;
    // Find the user.
    let userId = userID || user.id;
    if (!userId) throw new Error("User not found");
    // TODO get user and check if they are a creator
    const creator = await User.find({ _id: userId }).catch((err) => {
      throw new Error("Invalid userID");
    });
    // If the user doesn't exist, throw an error.
    if (!creator) throw new Error("User not found");
    // Find all the contents linked to the user.
    let contents = await Content.find({
      owner: {
        $exists: true,
      },
    });
    contents = contents.filter((content) => {
      return content.owner.uid === userId;
    });
    // Return all the contents linked to the user.
    return contents;
  } catch (error) {
    // In case of an error, log the error and return null.
    console.error(error);
    return null;
  }
}
