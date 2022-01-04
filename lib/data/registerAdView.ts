import { correctPassword } from "../auth";
import { createAdData, getAdViews, updateAdViews } from "../requests/backend";

// Export defualt function for registering a view. The function takes in ADid as a string as its only parameter.
export default async function registerAdView(adID: string): Promise<void> {
  const views = await getAdViews(adID, correctPassword);
  await updateAdViews(adID, views + 1, correctPassword).catch(async (e) => {
    console.log(
  "Creating new ad data. Likely beacuse the ad data does not exist. ",
      e
    );
    await createAdData(adID, correctPassword);
    registerAdView(adID);
    return;
  });
}
