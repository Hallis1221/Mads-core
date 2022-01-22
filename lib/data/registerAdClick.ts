// TODO rate limit

import { correctPassword } from "../auth";
import { createAdData, getAdClicks, updateAdClicks } from "../logic/requests/backend";
import AdDataHistory from "../mongodb/models/adDataHistory";

// Export defualt function for registering a click. The function takes in ADid as a string as its only parameter.
export default async function registerAdClick(adID: any): Promise<void> {
  // save amount of clicks
  let clicks = await getAdClicks(adID, correctPassword);
  let now = new Date(Date.now());
  let date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  date.setHours(0, 0, 0, 0);
  // Try to update the views history.
  let updated = await AdDataHistory.updateOne(
    {
      adID: adID,
      date: date,
    },
    {
      $inc: {
        clicks: 1,
      },
    }
  );
  if (updated.modifiedCount === 0)
    // If the update failed, create a new history entry.
    await AdDataHistory.create({
      adID: adID,
      date: date,
      views: 0,
      clicks: 1,
      skips: 0,
    });
  // update clicks by 1
  await updateAdClicks(adID, clicks + 1, correctPassword).catch(async (e) => {
    // If the update fails, create a new adData with the adID and the password. It likely failed because the adData doesn't exist.
    console.log(
      "Creating new ad data. Likely beacuse the ad data does not exist. ",
      e
    );
    // Create the adData.
    await createAdData(adID, correctPassword);
    clicks = await getAdClicks(adID, correctPassword);
    await updateAdClicks(adID,  clicks + 1, correctPassword);
    // Return.
    return;
  });

  // Return.
  return;
}
