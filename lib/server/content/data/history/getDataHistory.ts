import createChartData from "../../../../../leglib/logic/dashboard/createChartData";
import ContentDataHistoryDB from "../../../../db/models/content/history";
import { ContentData } from "../../../../types/data/contentData";
import { ContentDataHistory } from "../../../../types/data/history/contentData";
import getHistory from "../../../history/getHistory";

export async function getContentDataHistory(
  contentID: string,
  subtractor: number = 0
): Promise<ContentDataHistory[]> {
  let afterDate = new Date(Date.now());
  afterDate.setMonth(afterDate.getMonth() - subtractor - 1);

  let beforeDate = new Date(Date.now());
  beforeDate.setMonth(beforeDate.getMonth() - subtractor);

  let contentData = await ContentDataHistoryDB.find({
    contentID,
    date: {
      $gte: afterDate,
      $lte: beforeDate,
    },
  });

  if (!contentData) throw new Error(`Content data not found for ${contentID}`);

  return contentData;
}

export async function getContentHistory(contentID: string) {
  if (!contentID)
      throw new Error("ContentID is required");

  let monthlyPerformance: Map<string, any> = new Map<string, any>();
  let oldMonthlyPerformance: Map<string, any> = new Map<string, any>();

  let contentDataHistory: ContentDataHistory[] = await getContentDataHistory(contentID);

  let getOldContentDataHistory: ContentDataHistory[] = await getContentDataHistory(contentID, 1);

  monthlyPerformance = getHistory(
      contentDataHistory,
      { contentID },
      new Map<string, any>()
  );

  oldMonthlyPerformance = getHistory(
      getOldContentDataHistory,
      { contentID },

      new Map<string, any>()
  );

  let views: number = 0;
  let clicks: number = 0;
  let skips: number = 0;

  for (let value of Array.from(monthlyPerformance.values())) {
      if (value.views)
          views += value.views;
      if (value.clicks)
          clicks += value.clicks;
      if (value.skips)
          skips += value.skips;
  }

  let chartData: ContentData[] = createChartData(
      monthlyPerformance,
      oldMonthlyPerformance
  );

  if (views === null)
      views = 0;
  if (clicks === null)
      clicks = 0;
  if (skips === null)
      skips = 0;

  return {
      views: views,
      clicks: clicks,
      skips: skips,
      contentID: contentID,
      chartData: chartData,
  };
}

