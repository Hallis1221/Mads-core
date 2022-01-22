import { correctPassword } from "../auth";
import {
  createAdData,
  getAdViews,
  updateAdViews,
} from "../logic/requests/backend";
import AdDataHistory from "../mongodb/models/adDataHistory";

// Export defualt function for registering a view. The function takes in ADid as a string as its only parameter.
export default async function registerAdView(adID: string): Promise<void> {
  // save amount of views
  let views = await getAdViews(adID, correctPassword);
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
        views: 1,
      },
    }
  );
  if (updated.modifiedCount === 0)
    // If the update failed, create a new history entry.
    await AdDataHistory.create({
      adID: adID,
      date: date,
      views: 1,
      clicks: 0,
      skips: 0,
    });

  // update views by 1
  await updateAdViews(adID, views + 1, correctPassword).catch(async (e) => {
    // If the update fails, create a new adData with the adID and the password. It likely failed because the adData doesn't exist.
    console.log(
      "Creating new ad data. Likely beacuse the ad data does not exist. Id: " +
        adID,
      e
    );
    // Create the adData.
    await createAdData(adID, correctPassword);
    views = await getAdViews(adID, correctPassword);
    await updateAdViews(adID, views + 1, correctPassword);
    // Return.
    return;
  });

  // Return.
  return;
}
