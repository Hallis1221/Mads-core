import { correctPassword } from "../auth";
import { createContentData, getContentViews, updateContentViews } from "../requests/backend";

// Export defualt function for registering a view. The function takes in ADid as a string as its only parameter.
export default async function registerContentView(contentID: string): Promise<void> {
  const views = await getContentViews(contentID, correctPassword);
  await updateContentViews(contentID, views + 1, correctPassword).catch(async (e) => {
    console.log(
      "Creating new content data. Likely beacuse the content data does not exist. ",
      e
    );
    await createContentData(contentID, correctPassword);
    registerContentView(contentID);
    return;
  });
}
