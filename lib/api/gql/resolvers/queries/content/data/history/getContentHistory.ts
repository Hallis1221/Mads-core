import createChartData from "../../../../../../../../leglib/logic/dashboard/createChartData";
import { isAuthorized } from "../../../../../../../auth/checks";
import { getContentHistory } from "../../../../../../../server/content/data/history/getDataHistory";
import { ContentData } from "../../../../../../../types/data/contentData";
import { User } from "../../../../../../../types/user";

// This is the resolver for the getContentHistory stats query. It takes in a contentID and returns the stats from the last month for the content.
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
