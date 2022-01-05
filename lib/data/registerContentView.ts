import { correctPassword } from "../auth";
import { createContentData, getContentViews, updateContentViews } from "../requests/backend";

// Export defualt function for registering a view. The function takes in ADid as a string as its only parameter.
export default async function registerContentView(contentID: string): Promise<void> {
  // save amount of views
  const views = await getContentViews(contentID, correctPassword);
  // update views by 1
  await updateContentViews(contentID, views + 1, correctPassword).catch(async (e) => {
    // If the update fails, create a new adData with the adID and the password. It likely failed because the adData doesn't exist.
    console.log(
      "Creating new content data. Likely beacuse the content data does not exist. ",
      e
    );
    // Create the contentData.
    await createContentData(contentID, correctPassword);
    // Call the registerContentView function again. (To make sure the view is registered)
    registerContentView(contentID);
    // Return.
    return;
  });

  // Return.
  return;
}
