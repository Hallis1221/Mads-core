import AdDataHistoryDB from "../../../db/models/ad/history";
import AdDataDB from "../../../db/models/ad/data";
import { createIntervalDate } from "../../../interval";

// Export defualt function for registering an ad view. The function takes in the adID as its only argument.
export default async function registerAdView(adID: string): Promise<void> {
  // Generate a date for the current date with intervalled accounted for
  const date: Date = createIntervalDate();

  // If the ad and date is not found in the history database, create a new entry
  if (!(await AdDataHistoryDB.findOne({ adID, date }))) {
    await AdDataHistoryDB.create({
      adID,
      date,
      clicks: 0,
      views: 1,
      skips: 0,
    });
  } else {
    // If the ad and date is found in the history database, increment the views by 1
    await AdDataHistoryDB.findOneAndUpdate(
      { adID, date },
      { $inc: { views: 1 } }
    );
  }

  // If the ad data is not found in the database, create a new entry
  if (!(await AdDataDB.findOne({ adID }))) {
    // Log that the ad data was not found in the database
    console.log(`Ad data not found for adID: ${adID}`);
    await AdDataDB.create({
      adID,
      clicks: 0,
      views: 1,
      skips: 0,
    });

    // Log that the ad data was created in the database
    console.log(`Ad data created for adID: ${adID}`);
  } else {
    // If the ad data is found in the database, increment the views by 1
    await AdDataDB.findOneAndUpdate({ adID }, { $inc: { views: 1 } });
  }
}
