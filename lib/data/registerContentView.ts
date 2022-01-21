import { correctPassword } from "../auth";
import { createContentData, getContentViews, updateContentViews } from "../logic/requests/backend";
import ContentData from "../mongodb/models/contentData";

// Export defualt function for registering a view. The function takes in ADid as a string as its only parameter.
export default async function registerContentView(contentID: string): Promise<void> {
  
  // save amount of views
  let views = await getContentViews(contentID, correctPassword);
  // update views by 1
  await updateContentViews(contentID, views + 1, correctPassword).catch(async (e) => {
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
  });

  let history = (await ContentData.findOne({ contentID: contentID })).history;

  let found = false;
  // If history does not contain the current date, create a new entry for the date.
  for (let i = 0; i < history.length; i++) {
    if (history[i]
    ) {
      let date = new Date(history[i].date);
      let today = Date.now();
      today.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);
      console.log(date, today);
      break;
    }
  
  }

  // If history is empty, create a new entry for the date.
  if (history.length === 0 || !found) {
    console.log("Creating new entry for date: " + new Date().toDateString());
    let date = new Date.now();
    date.setHours(0, 0, 0, 0);

    history.push({
      date: date.toDateString(),
      views: 1,
    });
  }

  // Update the history.
  await ContentData.updateOne(
    { contentID: contentID },
    { $set: { history: history } }
  ).catch((e) => {
    console.log("Error updating history: " + e);
  });
  // Return.
  return;
}
