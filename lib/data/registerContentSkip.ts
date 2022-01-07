// TODO rate limit

import { correctPassword } from "../auth";
import {
  createAdData,
  getContentSkips,
  updateContentSkips,
} from "../logic/requests/backend";

// Export defualt function for registering a skip. The function takes in ADid as a string as its only parameter.
export default async function registerContentSkip(
  contentID: string
): Promise<void> {
  // save amount of skips
  let skips = await getContentSkips(contentID, correctPassword);
  // update skips by 1
  await updateContentSkips(contentID, skips + 1, correctPassword).catch(
    async (e) => {
      // If the update fails, create a new adData with the adID and the password. It likely failed because the adData doesn't exist.
      console.log(
        "Creating new ad data. Likely beacuse the ad data does not exist. ",
        e
      );
      // Create the adData.
      await createAdData(contentID, correctPassword);
      skips = await getContentSkips(contentID, correctPassword);
      await updateContentSkips(contentID, skips + 1, correctPassword);
      // Return.
      return;
    }
  );

  // Return.
  return;
}
