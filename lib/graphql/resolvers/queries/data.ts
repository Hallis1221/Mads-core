// This is the resolver for the getUserContentPerformances query. It takes in a user or userID and returns all the views, clicks, and skips for the user across all the content linked to their UID.
// It is protected with either a password or a user passed to the query. If a user is passed, it returns the user's content performances. If a userID is passed, it returns the userIDS's content performances.

import { authenticated, correctPassword } from "../../../auth";
import {
  getContentData,
  getUserContentID,
} from "../../../logic/requests/backend";
import { isCreator } from "../../../logic/requests/frontend";
import ContentData from "../../../mongodb/models/contentData";
import User from "../../../mongodb/models/user";

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
    let uid = (await User.findOne({ email: user.user.email }))._id;
    return await getUserContentPerformancesByUserID(uid);
  } else {
    throw new Error("Unauthorized");
  }

  async function getUserContentPerformancesByUserID(userID: string) {
      let contents = [];
    let contentIDs = await getUserContentID(userID, password || correctPassword);
    for (var content of contentIDs) {
    let contentID = content.id;
      let data = await getContentData(contentID, password || correctPassword);
      contents.push(data);
    }
    return contents;
  }
}

export async function getContentHistory(
  _: any,
  { password, userID }: any,
  { req, user }: any
) {
  ContentData.historyModel.find({});
}