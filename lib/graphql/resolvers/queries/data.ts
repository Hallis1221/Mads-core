// This is the resolver for the getUserContentPerformances query. It takes in a user or userID and returns all the views, clicks, and skips for the user across all the content linked to their UID.
// It is protected with either a password or a user passed to the query. If a user is passed, it returns the user's content performances. If a userID is passed, it returns the userIDS's content performances.

import { authenticated, correctPassword } from "../../../auth";
import {
  getContentData,
  getUserContentID,
} from "../../../logic/requests/backend";
import { isCreator } from "../../../logic/requests/frontend";

export async function getUserContentPerformances(
  _: any,
  { password, userID }: any,
  { req, user }: any
) {
  if (password && authenticated(password) && userID) {
    return await getUserContentPerformancesByUserID(userID);
  } else if (
    user
    //&& isCreator(user.email)
  ) {
    return await getUserContentPerformancesByUserID(user.id);
  } else {
    throw new Error("Unauthorized");
  }

  async function getUserContentPerformancesByUserID(userID: string) {
      let contents = [];
    let contentIDs = await getUserContentID(userID, password || correctPassword);
    for (var content of contentIDs as Array<any>) {
    let contentID = content.id;
      let data = await getContentData(contentID, password || correctPassword);
      contents.push(data);
    }
    console.log(contents);
    return contents;
  }
}
