// This is the resolver for the getUserContentPerformances query. It takes in a user or userID and returns all the views, clicks, and skips for the user across all the content linked to their UID.
// It is protected with either a password or a user passed to the query. If a user is passed, it returns the user's content performances. If a userID is passed, it returns the userIDS's content performances.

import { authenticated, correctPassword } from "../../../auth";
import getOwner from "../../../data/owns";
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
    let contentIDs = await getUserContentID(
      userID,
      password || correctPassword
    );
    for (var content of contentIDs as Array<any>) {
      let contentID = content.id;
      let data = await getContentData(contentID, password || correctPassword);
      contents.push(data);
    }
    return contents;
  }
}

export async function getContentMonthHistory(
  _: any,
  { password, contentID }: any,
  { req, user }: any
) {
  if (
    ((password && authenticated(password) && contentID) ||
      (user && user.uid && (await getOwner(contentID)).uid === user.uid)) ===
    false
  )
    throw new Error("Unauthorized");

  let cdref: any = ContentData;

  // After date, 30 days from the current date
  let beforeDate = new Date();
  beforeDate.setDate(beforeDate.getDate() - 30);

  // Before date, current date
  let afterDate = new Date();

  let content = await cdref.historyModel().find({
    contentID: contentID,
    t: {
      $gte: beforeDate,
      $lt: afterDate,
    },
  });
  return content;
}

// Resolver for the getComperableContentHistory query. It takes in a contentID and returns the stats from the last month for the content.
export async function getComperableContentHistory(
  _: any,
  { contentID, password }: any,
  { req, user }: any
) {
  if (
    ((password && authenticated(password) && contentID) ||
      (user && user.uid && (await getOwner(contentID)).uid === user.uid)) ===
    false
  )
    throw new Error("Unauthorized");

  let cdref: any = ContentData;

  // After date, 30 days from the current date
  let beforeDate = new Date();
  beforeDate.setDate(beforeDate.getDate() - 60);

  // Before date, current date
  let afterDate = new Date();
  afterDate.setDate(afterDate.getDate() - 30);

  let content = await cdref.historyModel().find({
    contentID: contentID,
    t: {
      $gte: beforeDate,
      $lt: afterDate,
    },
  });
  return content;
}
