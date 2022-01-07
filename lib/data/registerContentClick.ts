import { correctPassword } from "../auth";
import { createContentData, getContentClicks, updateContentClicks } from "../logic/requests/backend";

// Export defualt function for registering a click. The function takes in contentID as a string as its only parameter.
export default async function registerContentClick(contentID: any): Promise<void> {
  // save amount of clicks
  let clicks: number = await getContentClicks(contentID, correctPassword);
  // update clicks by 1
  await updateContentClicks(contentID, clicks + 1, correctPassword).catch(async (e) => {
    // If the update fails, create a new contentData with the contentID and the password. It likely failed because the contentData doesn't exist.
    console.log(
      "Creating new content data. Likely beacuse the content data does not exist. ",
      e
    );
    // Create the contentData.
    await createContentData(contentID, correctPassword);
    clicks = await getContentClicks(contentID, correctPassword);
    await updateContentClicks(contentID, clicks + 1, correctPassword);
    // Return.
    return;
  });

  // Return.
  return;
}
