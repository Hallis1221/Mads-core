import { correctPassword } from "../auth";
import {
  createContentData,
  getContentClicks,
  updateContentClicks,
} from "../logic/requests/backend";
import ContentData from "../mongodb/models/contentData";
import ContentDataHistory from "../mongodb/models/contentDataHistory";

// Export defualt function for registering a click. The function takes in contentID as a string as its only parameter.
export default async function registerContentClick(
  contentID: any
): Promise<void> {
  // save amount of clicks
  let now = new Date(Date.now());
  let date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  date.setHours(1, 0, 0, 0);
  // Try to update the clicks history.
  let updated = await ContentDataHistory.updateOne(
    {
      contentID: contentID,
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
    await ContentDataHistory.create({
      contentID: contentID,
      date: date,
      clicks: 1,
      views: 0,
      skips: 0,
    });

  // update clicks by 1
  await ContentData.updateOne(
    {
      contentID: contentID,
    },
    {
      $inc: {
        clicks: 1,
      },
    }
  ).catch(async (e) => {
    // If the update fails, create a new contentData with the contentID and the password. It likely failed because the contentData doesn't exist.
    console.log(
      "Creating new content data. Likely beacuse the content data does not exist. ",
      e
    );
    // Create the contentData.
    await createContentData(contentID, correctPassword);
    await ContentData.updateOne(
      {
        contentID: contentID,
      },
      {
        $inc: {
          clicks: 1,
        },
      }
    );
    // Return.
    return;
  });

  // Return.
  return;
}
