// TODO rate limit

import { correctPassword } from "../auth";
import { createAdData, getAdClicks, updateAdClicks } from "../requests/backend";

// Export defualt function for registering a click. The function takes in ADid as a string as its only parameter.
export default async function registerAdClick(adID: any): Promise<void> {
  const clicks = await getAdClicks(adID, correctPassword);
  await updateAdClicks(adID, clicks + 1, correctPassword).catch(async (e) => {
    console.log(
      "Creating new ad data. Likely beacuse the ad data does not exist. ",
      e
    );
    await createAdData(adID, correctPassword);
    registerAdClick(adID);
    return;
  });
}
