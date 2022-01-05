// TODO rate limit

import { correctPassword } from "../auth";
import { createAdData, getAdClicks, updateAdClicks } from "../requests/backend";

// Export defualt function for registering a click. The function takes in ADid as a string as its only parameter.
export default async function registerAdClick(adID: any): Promise<void> {
  // save amount of clicks
  const clicks = await getAdClicks(adID, correctPassword);
  // update clicks by 1
  await updateAdClicks(adID, clicks + 1, correctPassword).catch(async (e) => {
    // If the update fails, create a new adData with the adID and the password. It likely failed because the adData doesn't exist.
    console.log(
      "Creating new ad data. Likely beacuse the ad data does not exist. ",
      e
    );
    // Create the adData.
    await createAdData(adID, correctPassword);
    // Call the registerAdClick function again. (To make sure the click is registered)
    registerAdClick(adID);
    // Return.
    return;
  });

  // Return.
  return;
}
