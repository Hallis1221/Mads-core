import { authenticated, permittedToWriteContent } from "../../../auth";
import { cleanDB } from "../../../logic/clean/cleanOldContentData";
import Content from "../../../mongodb/models/content";
import ContentData from "../../../mongodb/models/contentData";
import User from "../../../mongodb/models/user";

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

// This is the resovler for the createUserContent mutation. It takes in fewer inputs than the createContent mutation, but allows for a user to be passed instead of a password.
/* type def:
    title: String!
    link: String!
    tags: [String]!
*/

export async function userCreateContent(
  _: any,
  {
    input,
  }: {
    input: {
      title: string;
      link: string;
      tags: string[];
    };
  },
  { user }: any
) {
  // cleanDB()
  // Check that the user is authenticated.
  if (!permittedToWriteContent("", user)) throw new Error("Unauthorized");

  // Exctract the arguments from the input.
  let title = input.title;
  let link = input.link;
  let tags = input.tags.map((tag) => {
    return { tag: tag.toLowerCase() };
  });

  // Check if content with the same title already exists.
  let exsists = await Content.findOne({ title });
  if (exsists) throw new Error("Content with the same title already exists. It is recommended to use unique titles to avoid confusion. This is enforced to prevent accidental duplicate content.");

  // Create the content.
  let content = await Content.create({
    theme: "minecraft.marketplace",
    title: title,
    link: link,
    tags: tags,
    owner: {
      uid: (await User.findOne({ email: user.user.email }))._id,
      displayName: user.user.name ? user.user.name : "TODO",
    },
  });

  // Check if the content is undefined. If it is then it likely is invalid
  if (!content)
    throw new Error(
      "Woah! Planets crashed or something, cuz that didnt work D:. The content was not found after creating it, as such the content was likely not created. Please try again."
    );

    // Create the content data.
    let contentData = await ContentData.create({
      contentID: content._id,
      clicks: 0,
      views: 0,
      skips: 0,
    });

  // Return the content.
  return {
    content: content,
    data: contentData,
  };
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
