import AdDataHistoryDB from "../../../db/models/ad/history";
import AdDataDB from "../../../db/models/ad/data";
import { createIntervalDate } from "../../../interval";
import { logger } from "../../../log";

// Export defualt function for registering an ad click. The function takes in the adID as its only argument.
export default async function registerAdClick(adID: string): Promise<void> {
  // Generate a date for the current date with intervalled accounted for
  const date: Date = createIntervalDate();

  // If the ad and date is not found in the history database, create a new entry
  if (!(await AdDataHistoryDB.findOne({ adID, date }))) {
    await AdDataHistoryDB.create({
      adID,
      date,
      clicks: 1,
      views: 0,
      skips: 0,
    });
  } else {
    // If the ad and date is found in the history database, increment the clicks by 1
    await AdDataHistoryDB.findOneAndUpdate(
      { adID, date },
      { $inc: { clicks: 1 } }
    );
  }

  // If the ad data is not found in the database, create a new entry
  if (!(await AdDataDB.findOne({ adID }))) {
    // Log that the ad data was not found in the database
    logger.warn(
      `Ad data not found for adID: ${adID} in registerAdClick resolver`
    );
    await AdDataDB.create({
      adID,
      clicks: 1,
      views: 0,
      skips: 0,
    });

    // Log that the ad data was created in the database
    logger.warn(`Ad data created for adID: ${adID}`);
  } else {
    // If the ad data is found in the database, increment the clicks by 1
    await AdDataDB.findOneAndUpdate({ adID }, { $inc: { clicks: 1 } });
  }
}
