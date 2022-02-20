import PaymentsDB from "../../db/currency/payments";
import AdDataDB from "../../db/models/ad/data";
import AdDataHistoryDB from "../../db/models/ad/history";
import UserDB from "../../db/models/auth/user";
import ConfigDB from "../../db/models/config";
import ContentDB from "../../db/models/content";
import { logger } from "../../log";
import { Content } from "../../types/content";
import { ContentData } from "../../types/data/contentData";
import { getUserContentData } from "../content/data/getContentData";
import { getUserContent, getUserContentIDS } from "../content/getContent";

export default async function calculateAccountEarnings(userID: string) {
  calculateExcatAccountEarnings(userID);

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
    content = content[0] as ContentData;

    // Add the content's views to the total
    totalViews += content.views || 0;

    // Add the content's clicks to the total
    totalClicks += content.clicks || 0;
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

export async function calculateExcatAccountEarnings(userID: string) {
  // Find all the content the user has created
  const userContentIDS = await getUserContentIDS(userID);

  let totalPaid = 0;

  let processedContentIDS: any[] = [];
  // Iterate through the user's content
  for (var contentID of userContentIDS) {
    if (processedContentIDS.includes(contentID)) continue;

    // Translate contentID to string
    contentID = contentID._id.toString();

    // Find all the ads that have a object in the matches array that has the contentID
    const matchedAds = await AdDataDB.find({
      matches: {
        $elemMatch: {
          contentID: contentID,
        },
      },
    })
      .select("matches")
      .select("adID");

    let processedAds: any[] = [];
    // Iterate through the matched ads
    for (var ad of matchedAds) {
      if (processedAds.includes(ad.adID.toString())) continue;
      let viewsForAd = 0;
      let clicksForAd = 0;

      // Remove matches that are not for this content
      ad.matches = ad.matches.filter(
        (match: { contentID: any }) => match.contentID === contentID
      );

      // Iterate through the ad's matches
      for (var match of ad.matches) {
        // Find the stats for this match by accesing addatahistory with date of match.begins
        const stats = await AdDataHistoryDB.findOne({
          adID: ad.adID,
          date: match.begins,
        });

        // If stats doesn't exist, skip
        if (!stats) continue;

        viewsForAd += stats.views;
        clicksForAd += stats.clicks;
      }

      // If ad.matches is empty, skip
      if (ad.matches.length === 0) continue;

      // Get the total stats for this ad (We dont just do this the first time cuz we may not want for every ad)
      let adData = await AdDataDB.findOne({
        adID: ad.adID,
      })
        .select("paid")
        .select("adID")
        .select("views")
        .select("clicks");

      // Check if the ad has a input for amount paid for it
      if (!adData.paid) {
        logger.warn(
          `Ad ${ad.adID} has no amount paid for it. Skipping and creating paid property on it` +
            JSON.stringify(adData)
        );
        // Create a new paid property for the ad
        await AdDataDB.updateOne(
          { adID: ad.adID },
          {
            $set: {
              paid: {
                views: 0,
                clicks: 0,
              },
            },
          }
        );
      } else {
        if (processedAds.includes(ad.adID.toString())) continue;

        // Calculate how many percent of the ad's views and clicks came from this content
        const viewDominance =
          Math.round((viewsForAd / adData.views) * 10000) / 100;
        const clickDominance =
          Math.round((clicksForAd / adData.clicks) * 10000) / 100;

  
        // Get that percentage of the ad's amount paid
        const amountPaid =
          adData.paid.views * (viewDominance / 100) +
          adData.paid.clicks * (clickDominance / 100);

          logger.info(
            `User ${userID} has ${viewDominance}% of views and ${clickDominance}% of clicks for ad ${ad.adID}. Resulting in ${amountPaid}$`
          );

        if (amountPaid > adData.paid.views + adData.paid.clicks)
          throw new Error(
            `Ad ${ad.adID} has an amount paid that is greater than the total amount paid for it. Please contact support.`
          );
        if (typeof amountPaid !== "number" || isNaN(amountPaid)) {
          logger.warn(`Ad ${ad.adID} has an amount paid that is not a number.`);
          // Create a new paid property for the ad
          await AdDataDB.updateOne(
            { adID: ad.adID },
            {
              $set: {
                paid: {
                  views: 0,
                  clicks: 0,
                },
              },
            }
          );
        }
        // Add the amount paid to the total
        else totalPaid += amountPaid;
        
      }

      // Add the ad to the processedAds array
      processedAds.push(ad.adID.toString());
    }
  }

  return totalPaid;
}
