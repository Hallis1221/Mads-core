import { correctPassword } from "../auth";
import { createAdData, getAdViews, updateAdViews } from "../logic/requests/backend";

// Export defualt function for registering a view. The function takes in ADid as a string as its only parameter.
export default async function registerAdView(adID: string): Promise<void> {
  // save amount of views
  const views = await getAdViews(adID, correctPassword);
  // update views by 1
  await updateAdViews(adID, views + 1, correctPassword).catch(async (e) => {
    // If the update fails, create a new adData with the adID and the password. It likely failed because the adData doesn't exist.
    console.log(
  "Creating new ad data. Likely beacuse the ad data does not exist. Id: " + adID,
      e
    );
    // Create the adData.
    await createAdData(adID, correctPassword);
    await updateAdViews(adID, views + 1, correctPassword);
    // Return.
    return;
  });

  // Return.
  return;
}
