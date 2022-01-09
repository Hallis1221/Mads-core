import { authenticated } from "../../../auth";
import AdData from "../../../models/adData";

// This is the resolver for the createAdData mutation. It takes in the input and creates a new adData with the input as the data.
export async function createAdData(_: any, { input }: any) {
  // Check that the password is correct.
  if (!authenticated(input["password"])) return null;

  try {
    input["password"] = undefined;
    // Create the adData.
    const adData = new AdData(input);
    // Save the adData.
    const newAdData = await adData.save();
    // Return the adData.
    return newAdData;
  } catch (error) {
    // In case of an error, log the error and return null.
    console.error(error);
    return null;
  }
}


// This is the resolver for the upDateAdData mutation. It takes in the id and the input and updates the adData with the matching id with the input as the data.
export async function updateAdData(_: any, { adID, input }: any) {
  // Check that the password is correct.
  if (!authenticated(input["password"])) return null;

  try {
    // Find the adData with the matching id and update it with the input.
    input["password"] = undefined;
    input["adID"] = adID;
    let adData = await AdData.findOneAndUpdate(
      { adID: adID },
      { $set: input },
      { new: true }
    );
    // If the adData doesn't exist, throw an error.
    if (!adData) throw new Error("AdData not found");
    // Return the adData.
    return adData;
  } catch (error) {
    // In case of an error, log the error and return null.
    console.error(error);
    return null;
  }
}

// The resolver for the deleteAdData mutation. It takes in the id and the input (for the password) and deletes the adData with the matching id.
export async function deleteAdData(_: any, { adID, input }: any) {
  // Check that the password is correct.
  if (!authenticated(input["password"])) return null;

  try {
    input["password"] = undefined;
    // Find the adData with the matching id and delete it.
    await AdData.findOneAndDelete({ adID });
    // Return a success message.
    return "AdData deleted";
  } catch (error) {
    // In case of an error, log the error and return null.
    console.error(error);
    return null;
  }
}
