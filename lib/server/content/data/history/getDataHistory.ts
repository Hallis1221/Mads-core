import ContentDataHistoryDB from "../../../../db/models/content/history";

export async function getContentDataHistory(
  contentID: string,
  subtractor: number = 0
) {
  let afterDate = new Date(Date.now());
  afterDate.setMonth(afterDate.getMonth() - 1 - subtractor);

  let beforeDate = new Date(Date.now());
  beforeDate.setMonth(beforeDate.getMonth() - subtractor);

  let contentData = await ContentDataHistoryDB.findOne({
    contentID,
    date: {
      $gte: afterDate,
      $lte: beforeDate,
    },
  });

  if (!contentData) throw new Error("Content data not found");

  return contentData;
}