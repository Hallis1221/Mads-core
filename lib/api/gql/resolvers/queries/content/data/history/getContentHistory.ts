import { isAuthorized } from "../../../../../../../auth/checks";
import UserDB from "../../../../../../../db/models/auth/user";
import { getContentHistory } from "../../../../../../../server/content/data/history/getDataHistory";
import {
  getUserContent,
  getUserContentIDS,
} from "../../../../../../../server/content/getContent";
import { ContentData } from "../../../../../../../types/data/contentData";
import { User } from "../../../../../../../types/user";

// This is the resolver for the getContentHistory stats query. It takes in a contentID and returns the stats from the last month and this month for the content.
export async function getContentHistoryQuery(
  _: any,
  { contentID, apiKey }: { contentID: string; apiKey: string },
  { user }: { user: User }
): Promise<{
  views: number;
  clicks: number;
  skips: number;
  chartData: ContentData[];
}> {
  if (apiKey)
    if (await isAuthorized("admin", apiKey, { contentid: contentID }))
      return await getContentHistory(contentID);

  if (user)
    if (await isAuthorized("user", user, { contentid: contentID }))
      return await getContentHistory(contentID);

  throw new Error(
    "You need to be logged or provide an apikey to perform this action"
  );
}

// This is the resolver for the getAllContentHistory stats query. It takes in a userID, or a user in the context, and returns the stats from the last month and this month for all the content the user owns.
export async function getAllContentHistoryQuery(
  _: any,
  { apiKey, userID }: { apiKey: string; userID: string },
  { user }: { user: User }
): Promise<
  {
    views: number;
    clicks: number;
    skips: number;
    chartData: ContentData[];
  }[]
> {
  if (apiKey)
    if (await isAuthorized("admin", apiKey, { contentid: undefined })) {
      let userContentIDS = await getUserContentIDS(userID);

      if (!userContentIDS) throw new Error("User content not found");

      // Convert userContentIDS to a list of ids by running ._id on each element
      userContentIDS = userContentIDS.map((content) => content._id);
      let contentHistory: {
        views: number;
        clicks: number;
        skips: number;
        chartData: ContentData[];
      }[];

      // Iterate through each content and get the history for it
      contentHistory = await Promise.all(
        userContentIDS.map(async (contentID) => {
          return await getContentHistory(contentID._id.toString());
        })
      );

      return contentHistory;
    }

  if (user && (await isAuthorized("user", user, { contentid: undefined })))
    if (
      (await isAuthorized("user", user, { contentid: undefined })) &&
      user.id
    ) {
      let content = await getUserContent(user.id);

      // Convert _id to contentID
      content = content.map((content) => {
        content.contentID = content._id.toString();
        delete content._id;
        return content;
      });

      return content;
    } else {
      user.id = (
        await UserDB.findOne({ email: user.email }).select("_id")
      )._id.toString();
      if (user.id) {
        let contents = await getUserContent(user.id);

        // Convert _id to contentID
        contents = contents.map((content) => {
          content.contentID = content._id.toString();
          delete content._id;
          return content;
        });

        // Get the content history for each content
        contents = await Promise.all(
          contents.map(async (content) => {
            return await getContentHistory(content.contentID);
          })
        );

        return contents;
      }
    }

  throw new Error(
    `    You need to be logged or provide an apiKey to get all user content history. User provided: ${user.user}/${user}, key provided: ${apiKey}`
  );
}
