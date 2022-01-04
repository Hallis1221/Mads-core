import { correctPassword } from "../auth";
import { createContentData, getContentClicks, updateContentClicks } from "../requests/backend";

// Export defualt function for registering a click. The function takes in contentID as a string as its only parameter.
export default async function registerContentClick(contentID: any): Promise<void> {
  const clicks = await getContentClicks(contentID, correctPassword);
  await updateContentClicks(contentID, clicks + 1, correctPassword).catch(async (e) => {
    console.log(
      "Creating new content data. Likely beacuse the contnet data does not exist. ",
      e
    );
    await createContentData(contentID, correctPassword);
    registerContentClick(contentID);
    return;
  });
}
