import PaymentsDB from "../../db/currency/payments";
import AdDataDB from "../../db/models/ad/data";
import UserDB from "../../db/models/auth/user";
import ConfigDB from "../../db/models/config";
import ContentDB from "../../db/models/content";
import ContentDataHistoryDB from "../../db/models/content/history";
import { Content } from "../../types/content";
import { ContentData } from "../../types/data/contentData";
import { getUserContentData } from "../content/data/getContentData";

export default async function calculateAccountEarnings(userID: string) {
  let prices = (
    await ConfigDB.findOne({
      name: "prototyping",
    }).select("prices")
  )?.prices;

  if (!prices) throw new Error("No prices found");

  // Get the user's content data
  const userContent: any = await getUserContentData(userID);

  // Store totals for views and clicks
  let totalViews = 0;
  let totalClicks = 0;

  // Iterate through the user's content
  for (var content of userContent) {
     content = content[0]
    let matches = await AdDataDB.findOne({
      // Check if the matches array on adData included a element with contentID equal to the current contentID
      $or: [
        {
          matches: {
            $elemMatch: {
              contentID: content.contentID,
            },
          },
        },
        {
          contentID: content.contentID,
        },
      ],
    });

    // If there are no matches, skip this content
    if (!matches) continue;

    // For each match
    for (var match of matches.matches) {
      // Get the time duration of the match by taking match.ends - match.begins
      let duration = match.ends - match.begins;

      // Convert to how many half hours the match lasted
      // TODO maybe have this be set from configDB

      let halfHours = Math.floor(duration / (1000 * 60 * 30));

      if (halfHours !== 1)
        throw new Error(
          "One match lasts for something other than half an hour"
        );

      // Get the contentdatahistory entry beginning at match.begins
      let contentDataHistory = await ContentDataHistoryDB.findOne({
        date: match.begins,
      });
    }

    // Get the contentDataHistory entry with the same contentID as the current content
    let contentDataHistory = await ContentDataHistoryDB.findOne({
      contentID: content.contentID,
    });

    if (contentDataHistory.contentID !== content.contentID) continue; 
    console.log(contentDataHistory, content.contentID);
  }
  // Calculate the earnings
  const earnings = totalClicks * prices.click + totalViews * prices.view;

  return earnings;
}

export async function calculateAccountPaidout(userID: string, type: string) {
  if (type === "any") {
    let paidout = 0;

    // Find all payments in the PaymentsDB that have a status of pending or complete
    const payments = await PaymentsDB.find({
      userID,
      $or: [{ status: "pending" }, { status: "complete" }],
    });

    for (var payment of payments) paidout += payment.amount;

    return paidout;
  }

  let payments = await PaymentsDB.find({
    userID: userID,
    $or: [{ status: "pending" }, { status: "complete" }],
    type: type,
  }).select("amount");

  let total = 0;

  for (var payment of payments) {
    total += payment.amount;
  }

  return total;
}
