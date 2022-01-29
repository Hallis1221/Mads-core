import ContentDataDB from "../../../db/models/content/data";
import ContentDataHistoryDB from "../../../db/models/content/history";
import { createIntervalDate } from "../../../interval";

// Export defualt function for registering a click. The function takes in the contentID as its only argument.
export default async function registerContentClick(
  contentID: string
): Promise<void> {
  // Generate a date for the current date with intervalled accounted for
  const date: Date = createIntervalDate();

  // If the content and date is not found in the history database, create a new entry
  if (!(await ContentDataHistoryDB.findOne({ contentID, date }))) {
    await ContentDataHistoryDB.create({
      contentID,
      date,
      clicks: 1,
      views: 0,
      skips: 0,
    });
  } else {
    // If the content and date is found in the history database, increment the clicks by 1
    await ContentDataHistoryDB.findOneAndUpdate(
      { contentID, date },
      { $inc: { clicks: 1 } }
    );
  }

  // If the content data is not found in the database, create a new entry
  if (!(await ContentDataDB.findOne({ contentID }))) {
    // Log that the content data was not found in the database
    console.log(`Content data not found for contentID: ${contentID}`);
    await ContentDataDB.create({
      contentID,
      clicks: 1,
      views: 0,
      skips: 0,
    });

    // Log that the content data was created in the database
    console.log(`Content data created for contentID: ${contentID}`);
  } else {
    // If the content data is found in the database, increment the clicks by 1
    await ContentDataDB.findOneAndUpdate(
      { contentID },
      { $inc: { clicks: 1 } }
    );
  }
}
