import ContentDataDB from "../../../db/models/content/data";
import ContentDataHistoryDB from "../../../db/models/content/history";
import { createIntervalDate } from "../../../interval";

// Export defualt function for registering a content view. The function takes in the contentID as its only argument.
export default async function registerContentView(
  contentID: string
): Promise<void> {
  // Generate a date for the current date with intervalled accounted for
  const date: Date = createIntervalDate();

  // If the content and date is not found in the history database, create a new entry
  if (!(await ContentDataHistoryDB.findOne({ contentID, date }))) {
    await ContentDataHistoryDB.create({
      contentID,
      date,
      clicks: 0,
      views: 1,
      skips: 0,
    });
  } else {
    // If the content and date is found in the history database, increment the views by 1
    await ContentDataHistoryDB.findOneAndUpdate(
      { contentID, date },
      { $inc: { views: 1 } }
    );
  }

  // If the content data is not found in the database, create a new entry
  if (!(await ContentDataDB.findOne({ contentID }))) {
    // Log that the content data was not found in the database
    console.log(`Content data not found for contentID: ${contentID}`);
    await ContentDataDB.create({
      contentID,
      clicks: 0,
      views: 1,
      skips: 0,
    });

    // Log that the content data was created in the database
    console.log(`Content data created for contentID: ${contentID}`);
  } else {
    // If the content data is found in the database, increment the views by 1
    await ContentDataDB.findOneAndUpdate({ contentID }, { $inc: { views: 1 } });
  }
}
