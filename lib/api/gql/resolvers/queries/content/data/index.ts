import { isAuthorized } from "../../../../../../auth/checks";
import UserDB from "../../../../../../db/models/auth/user";
import ContentDataDB from "../../../../../../db/models/content/data";
import ContentDataHistoryDB from "../../../../../../db/models/content/history";
import { getUserContentData } from "../../../../../../server/content/data/getContentData";
import { getContentDataHistory } from "../../../../../../server/content/data/history/getDataHistory";
import { ContentData } from "../../../../../../types/data/contentData";
import { User } from "../../../../../../types/user";

// This is the resolver for the getContentData query. It takes in the contentID and returns the contentData with the matching contentID.
export async function getContentDataQuery(
  _: any,
  { contentID }: { contentID: string },
  { user }: { user: User }
): Promise<ContentData> {
  if (await isAuthorized("none", user, { contentid: contentID })) {
    let contentData = await ContentDataDB.findOne({ contentID });

    if (!contentData) throw new Error(`Content data not found for  ${contentID}`);

    return contentData;
  } else {
    throw new Error("User is not authorized to get content data");
  }
}

// This is the resolver for the getUserContentData query. It takes in the user or userID and returns all the contentData linked to the user.
export async function getUserContentDataQuery(
  _: any,
  {
    apiKey,
    userID,
  }: { apiKey: string | undefined; userID: string | undefined },
  { user }: { user: User | undefined }
): Promise<ContentData[]> {
  if (apiKey)
    if (await isAuthorized("admin", apiKey, { contentid: undefined }))
      if (!userID) throw new Error("UserID is required");
      else return await getUserContentData(userID);

  if (user)
    if (await isAuthorized("creator", user, { contentid: undefined })) {
      if (!user.id)
        user.id = (
          await UserDB.findOne({ email: user.email }).select("_id")
        )._id;

      if (user.id) return await getUserContentData(user.id);
    } else throw new Error("User is not authorized to get user content data");

  throw new Error(
    "You need to be logged or provide an apikey to perform this action"
  );
}

// This is the resolver for the getContentDataMonth query. It takes in a contentID and returns the stats from the current month for the content.
export async function getContentDataMonthQuery(
  _: any,
  { contentID, apiKey }: { contentID: string; apiKey: string },
  { user }: { user: User }
): Promise<ContentData[]> {
  if (apiKey)
    if (await isAuthorized("admin", apiKey, { contentid: undefined }))
      return await getContentDataHistory(contentID);

  if (user)
    if (await isAuthorized("user", user, { contentid: undefined }))
      return await getContentDataHistory(contentID);
    else throw new Error("User is not authorized to get content data");

  throw new Error(
    "You need to be logged or provide an apikey to perform this action"
  );
}

// This is the resolver for the getLastContentData query. It takes in a contentID and returns the stats from the last month for the content.
export async function getLastContentDataQuery(
  _: any,
  { contentID, apiKey }: { contentID: string; apiKey: string },
  { user }: { user: User }
): Promise<ContentData[]> {
  if (apiKey)
    if (await isAuthorized("admin", apiKey, { contentid: undefined }))
      return await getContentDataHistory(contentID, 1);

  if (user)
    if (await isAuthorized("user", user, { contentid: undefined }))
      return await getContentDataHistory(contentID, 1);
    else throw new Error("User is not authorized to get user content data");

  throw new Error(
    "You need to be logged or provide an apikey to perform this action"
  );
}
