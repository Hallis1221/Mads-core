import ContentDataDB from "../../../db/models/content/data";
import ContentDataHistoryDB from "../../../db/models/content/history";
import { createIntervalDate } from "../../../interval";
import { logger } from "../../../log";

// Export defualt function for registering a content skip. The function takes in the contentID as its only argument.
export default async function registerContentSkip(
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
      views: 0,
      skips: 1,
    });
  } else {
    // If the content and date is found in the history database, increment the skips by 1
    await ContentDataHistoryDB.findOneAndUpdate(
      { contentID, date },
      { $inc: { skips: 1 } }
    );
  }

  // If the content data is not found in the database, create a new entry
  if (!(await ContentDataDB.findOne({ contentID }))) {
    // Log that the content data was not found in the database
    logger.warn(`Content data not found for contentID: ${contentID}`);
    await ContentDataDB.create({
      contentID,
      clicks: 0,
      views: 0,
      skips: 1,
    });

    // Log that the content data was created in the database
    logger.warn(`Content data created for contentID: ${contentID}`);
  } else {
    // If the content data is found in the database, increment the skips by 1
    await ContentDataDB.findOneAndUpdate({ contentID }, { $inc: { skips: 1 } });
  }
}
