import createChartData from "../../../../../../../../leglib/logic/dashboard/createChartData";
import { isAuthorized } from "../../../../../../../auth/checks";
import { getContentHistory } from "../../../../../../../server/content/data/history/getDataHistory";
import { getUserContent, getUserContentIDS } from "../../../../../../../server/content/getContent";
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
  { apiKey, userID }: { apiKey: string, userID: string },
  { user }: { user: User }
): Promise<{
  views: number;
  clicks: number;
  skips: number;
  chartData: ContentData[];
}> {
  if (apiKey)
    if (await isAuthorized("admin", apiKey, { contentid: undefined }))
      {
        let userContent = await getUserContentIDS(userID);

        if (!userContent) throw new Error("User content not found");
      }

  if (user)
    if (await isAuthorized("user", user, { contentid: undefined }) && user.id)
    await getUserContent(user.id);

     

  throw new Error(
    "You need to be logged or provide an apikey to perform this action"
  );
}