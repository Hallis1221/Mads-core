import { authenticated } from "../../../auth";
import AdData from "../../../mongodb/models/adData";
import ContentData from "../../../mongodb/models/contentData";

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

// The resolver for the addAdDataMatch mutation. It takes in the id and a matchinput (with the contentID to match, a begins date and an end date) and adds a match to the adData with the matching id.
export async function addAdDataMatch(_: any, { adID, input }: any) {
  // Check that the password is correct.
  if (!authenticated(input["password"])) return null;

  try {
    input["password"] = undefined;

    // Instead of checking the validity of the input all at once we do it in several steps to give a more detailed error message.
    // Find the adData with the matching id.
    let adData = await AdData.findOne({ adID });
    // If the adData doesn't exist, throw an error.
    if (!adData) throw new Error("AdData not found");
    // Check if the adData has a match with the matching contentID, begins date and ends date.
    let match = adData.matches.find((match: any) => {
      let matchBegins = new Date(match.begins).getTime();
      let matchEnds = new Date(match.ends).getTime();
      let inputBegins = new Date(input.begins).getTime();
      let inputEnds = new Date(input.ends).getTime();
      if (
        match.contentID === input.contentID &&
        matchBegins === inputBegins &&
        matchEnds === inputEnds
      )
        return true;
    });
    // If the match does exist, throw an error.
    if (match) return new Error("Match already exists");

    // Check if the adData already has a match beginning at the same time as the new match.
    let matchBegin = adData.matches.find((match: any) => {
      let matchBegins = new Date(match.begins).getTime();
      let inputBegins = new Date(input.begins).getTime();
      if (matchBegins === inputBegins) return true;
    });

    // If the match already exists, throw an error.
    if (matchBegin) return new Error("A match already begins at the same time");

    // Check if there exsits a match starting after the new match.
    let matchAfter = adData.matches.find((match: any) => {
      let matchBegins = new Date(match.begins).getTime();
      let inputBegins = new Date(input.begins).getTime();
      if (matchBegins > inputBegins) return true;
    });

    // If there is a match starting after the new match, throw an error.
    if (matchAfter) return new Error("A match starts after the new match. You may not alter time. Your inputBegins was: " + input.begins);

    // Check if the contentID is valid.
    let content = await ContentData.findOne({ contentID: input.contentID });

    // If the contentID is not valid, throw an error.
    if (!content) return new Error("ContentID is not valid");

    // Check if the adData already has a match ending at the same time as the new match.
    let matchEnd = adData.matches.find((match: any) => {
      let matchEnds = new Date(match.ends).getTime(); 
      let inputEnds = new Date(input.ends).getTime();
      if (matchEnds === inputEnds) return true;
    });

    // If the match already exists, throw an error.
    if (matchEnd) return new Error("A match already ends at the same time");

    // Check that that the new inputbegins is before the new inputends.
    if ( new Date(input.begins).getTime() >  new Date(input.ends).getTime()) return new Error("Your inputBegins is after your inputEnds");

    // Check if the time span between the new input begins and ends is valid. It is valid if it is less than or equal to a day.
    let timeSpan = new Date(input.ends).getTime() - new Date(input.begins).getTime();
    if (timeSpan > 86400000) return new Error("The time span between the new match begins and ends is greater than a day");

    // Could check if the begins date is present in addatas_history.
    
    // Add the match to the adData.
    adData.matches.push(input);
    // Save the adData.
    adData = await adData.save();
    // Return the adData.
    return adData;
  } catch (error) {
    // In case of an error, log the error and return null.
    console.error(error);
    return null;
  }
}
