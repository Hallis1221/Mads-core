// TODO rate limit

import { correctPassword } from "../auth";
import {
  createAdData,
  getContentSkips,
  updateContentSkips,
} from "../logic/requests/backend";
import ContentDataHistory from "../mongodb/models/contentDataHistory";

// Export defualt function for registering a skip. The function takes in ADid as a string as its only parameter.
export default async function registerContentSkip(
  contentID: string
): Promise<void> {
  // save amount of skips
  let skips = await getContentSkips(contentID, correctPassword);
  let now = new Date(Date.now());
  let date = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  date.setHours(1, 0, 0, 0);
  // Try to update the skips.
  let updated = await ContentDataHistory.updateOne(
    {
      contentID: contentID,
      date: date,
    },
    {
      $inc: {
        skips: 1,
      },
    }
  );

  if (updated.modifiedCount === 0) 
    // If the update failed, create a new history entry.
    await ContentDataHistory.create({
      contentID: contentID,
      date: date,
      skips: 1,
      views: 0,
      clicks: 0,
    });

  // update skips by 1
  await updateContentSkips(contentID, skips + 1, correctPassword).catch(
    async (e) => {
      // If the update fails, create a new adData with the adID and the password. It likely failed because the adData doesn't exist.
      console.log(
        "Creating new ad data. Likely beacuse the ad data does not exist. ",
        e
      );
      // Create the adData.
      await createAdData(contentID, correctPassword);
      skips = await getContentSkips(contentID, correctPassword);
      await updateContentSkips(contentID, skips + 1, correctPassword);
      // Return.
      return;
    }
  );

  // Return.
  return;
}
