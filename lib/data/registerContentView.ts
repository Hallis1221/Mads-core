import { correctPassword } from "../auth";
import {
  createContentData,
  getContentViews,
  updateContentViews,
} from "../logic/requests/backend";
import ContentDataHistory from "../mongodb/models/contentDataHistory";

// Export defualt function for registering a view. The function takes in ADid as a string as its only parameter.
export default async function registerContentView(
  contentID: string
): Promise<void> {
  // save amount of views
  let views = await getContentViews(contentID, correctPassword);
  let now = new Date(Date.now());
  let date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  date.setHours(0, 0, 0, 0);
  // Try to update the views.
  let updated = await ContentDataHistory.updateOne(
    {
      contentID: contentID,
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
    await ContentDataHistory.create({
      contentID: contentID,
      date: date,
      views: 1,
    });

  // update views by 1
  await updateContentViews(contentID, views + 1, correctPassword).catch(
    async (e) => {
      // If the update fails, create a new adData with the adID and the password. It likely failed because the adData doesn't exist
      console.log(
        "Creating new content data. Likely beacuse the content data does not exist. ",
        e
      );
      // Create the contentData.
      await createContentData(contentID, correctPassword);
      views = await getContentViews(contentID, correctPassword);
      await updateContentViews(contentID, views + 1, correctPassword);
      // Return.
      return;
    }
  );

  // Return.
  return;
}
