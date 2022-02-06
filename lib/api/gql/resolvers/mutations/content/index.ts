import { isAuthorized } from "../../../../../auth/checks";
import { permittedToCreateContent } from "../../../../../auth/checks/content";
import UserDB from "../../../../../db/models/auth/user";
import ContentDB from "../../../../../db/models/content";
import ContentDataDB from "../../../../../db/models/content/data";
import { Content } from "../../../../../types/content";
import { ContentData } from "../../../../../types/data/contentData";
import { User } from "../../../../../types/user";

// This is the resolver for the createContent mutation.  It takes in an content object and creates a new ad with the ad object.
export async function adminCreateContentMutation(
  _: any,
  {
    content,
    apiKey,
  }: {
    content: Content;
    apiKey: string;
  },
  { user }: { user: User }
): Promise<Content> {
  // Check if the apiKey is valid
  if (await isAuthorized("admin", apiKey, { contentid: undefined })) {
    const addb = new ContentDB(content);
    const newcontent = await addb.save();
    return newcontent;
  } else {
    throw new Error("User is not authorized to create an content");
  }
}

export async function createContentMutation(
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
) {
  let contentInput = content;

  if (await permittedToCreateContent(user)) {
    const title: string = contentInput.title;
    const link: string = contentInput.link;
    let tags: string[] = contentInput.tags.map((tag: any) => {
      if (typeof tag === "string") return tag.toLowerCase();
      else if (typeof tag === "object") return tag.tag.toLowerCase();
      else return "undefined tag";
    });

    const exsists = await ContentDB.findOne({ title });
    if (exsists)
      throw new Error(
        "Content with the same title already exists. It is recommended to use unique titles to avoid confusion. This is enforced to prevent accidental duplicate content."
      );

    // Convert tags to object if they are strings
    tags = tags.map((tag: any) => {
      if (typeof tag === "string") return { tag };
      else return tag;
    });
    const content: Content = {
      title,
      link,
      tags,
      owner: {
        uid: (await UserDB.findOne({ email: user.email }))._id || "",
        displayName: user.name ? user.name : "TODO",
      },
      _id: undefined,
      theme: "minecraft.marketplace",
    };

    const contentDB = await ContentDB.create(content);

    if (!contentDB)
      throw new Error(
        "Woah! Planets crashed or something, cuz that didnt work D:. The content was not found after creating it, as such the content was likely not created. Please try again."
      );

    const contentData: ContentData = {
      contentID: contentDB._id,
      views: 0,
      clicks: 0,
      skips: 0,
    };

    const contentDataDB = await ContentDataDB.create(contentData);
    return {
      content: contentDB,
      data: contentDataDB,
    };
  }

  throw new Error("User is not authorized to create an content");
}

// This is the resolver for the updateContent mutation.  It takes in an content object and updates the ad with the ad object.
export async function updateContentMutation(
  _: any,
  {
    contentID,
    apiKey,
    content,
  }: {
    contentID: string;
    apiKey: string;
    content: {
      title: string;
      link: string;
      tags: string[];
    };
  },
  { user }: { user: User }
): Promise<Content> {

  let tags = content.tags.map((tag: any) => {
    if (typeof tag === "string") return { tag };
    else return tag;
  });

  if (tags.length > 5) throw new Error("You can only have 5 tags");
  if (content.title.length > 50) throw new Error("Title is too long");
  if (content.link.length > 25) throw new Error("Link is too long");
  

  // Check if the apiKey is valid
  if (await isAuthorized("creator", user || apiKey, { contentid: contentID })) {
    const newcontent = await ContentDB.findByIdAndUpdate(contentID, {
      $set: {
        title: content.title,
        link: content.link,
        tags,
      },
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
