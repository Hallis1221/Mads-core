import { isAuthorized } from "../../../../../auth/checks";
import ContentDB from "../../../../../db/models/content";
import {
  getContent,
  getUserContent,
} from "../../../../../server/content/getContent";
import { Content } from "../../../../../types/content";
import { User } from "../../../../../types/user";

// This is the resolver for the getContent query. It takes in the id of the content and returns the content with the matching id.
export async function getContentQuery(
  _: any,
  { id }: { id: string },
  { user }: { user: User }
): Promise<Content> {
  if (
    await isAuthorized("none", user, {
      contentid: id,
    })
  ) {
    return await getContent(id);
  } else {
    throw new Error("User is not authorized to get content");
  }
}

// This is the resolver for the getContents query. It takes in the api key and returns all the contents.
export async function getContentsQuery(
  _: any,
  { apiKey }: { apiKey: string }
): Promise<Content[]> {
  if (await isAuthorized("admin", apiKey, undefined)) {
    return await getContent(undefined);
  }
}

// This is the resolver for the getUserContent query. It takes in the user or userID and returns all the contents linked to the user.
export async function getUserContentQuery(
  _: any,
  {
    apiKey,
    userID,
  }: { apiKey: string | undefined; userID: string | undefined },
  { user }: { user: User | undefined }
): Promise<Content[]> {
  if (apiKey)
    if (await isAuthorized("admin", apiKey, undefined))
      return await getUserContent(userID);

  if (user)
    if (await isAuthorized("user", user, undefined))
      return await getUserContent(user.id);
}
