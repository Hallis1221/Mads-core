import { isAuthorized } from "../../../../../auth/checks";
import { isCreator } from "../../../../../auth/checks/user";
import PaymentsDB from "../../../../../db/currency/payments";
import ApiDB from "../../../../../db/models/auth/api";
import UserDB from "../../../../../db/models/auth/user";
import ConfigDB from "../../../../../db/models/config";
import calculateAccountEarnings, {
  calculateAccountPaidout,
} from "../../../../../server/currency/calculateEarnings";
import {
  getStripeOnboardingLink,
  getUserStripeID,
} from "../../../../../server/user";
import { User } from "../../../../../types/user";

// This is the resolver for the isCreator query. It takes in the userID and adID as its only argument and returns true if the user is a creator
export async function isCreatorQuery(
  _: undefined,
  { email }: { email: string | undefined },
  { user }: { user: User }
): Promise<boolean> {
  if (email) return await isCreator(email);
  else if (user) return await isCreator(user.email);

  return false;
}

// This is the resolver for the getUserStripeID query.
export async function getUserStripeIDQuery(
  _: undefined,
  { apiKey }: { apiKey: string },
  { user }: { user: User }
): Promise<string> {
  if (apiKey) {
    if (!(await isAuthorized("creator", apiKey, { contentid: undefined })))
      throw new Error("API key is not authorized as creator");

    // Get the user id from the api key
    let userID: string | undefined = (await ApiDB.findOne({ apiKey })).userID;

    if (!userID) throw new Error("API key is not associated with a user");

    return await getUserStripeID(userID);
  }
  if (user) {
    const userDB = await UserDB.findOne({
      email: user.email || user.user.email,
    });
    return getUserStripeID(userDB._id);
  }

  throw new Error("Unathorized");
}

// This is the resolver for the getUserStripeOnboardingLink query.
export async function getUserStripeOnboardingLinkQuery(
  _: undefined,
  { apiKey }: { apiKey: string },
  { user }: { user: User }
): Promise<string> {
  if (apiKey) {
    if (!(await isAuthorized("creator", apiKey, { contentid: undefined })))
      throw new Error("API key is not authorized as creator");

    // Get the user id from the api key
    let userID: string | undefined = (await ApiDB.findOne({ apiKey })).userID;

    if (!userID) throw new Error("API key is not associated with a user");

    return await getStripeOnboardingLink(await getUserStripeID(userID));
  }
  if (user) {
    const userDB = await UserDB.findOne({
      email: user.email || user.user.email,
    });
    return await getStripeOnboardingLink(await getUserStripeID(userDB._id));
  }

  throw new Error("Unathorized");
}

// This is the resolver for the calculateCreatorLifetimeEarnings query.
export async function calculateCreatorLifetimeEarningsQuery(
  _: undefined,
  { apiKey }: { apiKey: string },
  { user }: { user: User }
): Promise<number> {
  if (apiKey) {
    if (!(await isAuthorized("creator", apiKey, { contentid: undefined })))
      throw new Error("API key is not authorized as creator");

    // Get the user id from the api key
    let userID: string | undefined = (await ApiDB.findOne({ apiKey })).userID;

    if (!userID) throw new Error("API key is not associated with a user");

    return await calculateAccountEarnings(userID);
  }
  if (user) {
    const userDB = await UserDB.findOne({
      email: user.email || user.user.email,
    });
    return await calculateAccountEarnings(userDB._id.toString());
  }

  throw new Error("Unathorized");
}

// This is the resolver for the getPaymentHistory query.
export async function getPaymentHistoryQuery(
  _: undefined,
  { apiKey }: { apiKey: string },
  { user }: { user: User }
): Promise<any> {
  if (apiKey) {
    if (!(await isAuthorized("creator", apiKey, { contentid: undefined })))
      throw new Error("API key is not authorized as creator");

    // Get the user id from the api key
    let userID: string | undefined = (await ApiDB.findOne({ apiKey })).userID;

    if (!userID) throw new Error("API key is not associated with a user");

    return await PaymentsDB.find({ userID });
  }
  if (user) {
    const userDB = await UserDB.findOne({
      email: user.email || user.user.email,
    });
    return await PaymentsDB.find({ userID: userDB._id.toString() });
  }

  throw new Error("Unathorized");
}

// THis is the resolver for the getAvalibleCreatorPayoutAmount query.
export async function getAvalibleCreatorPayoutAmountQuery(
  _: undefined,
  { apiKey }: { apiKey: string },
  { user }: { user: User }
): Promise<any> {
  if (apiKey) {
    if (!(await isAuthorized("creator", apiKey, { contentid: undefined })))
      throw new Error("API key is not authorized as creator");

    // Get the user id from the api key
    let userID: string | undefined = (await ApiDB.findOne({ apiKey })).userID;

    if (!userID) throw new Error("API key is not associated with a user");

    let balance =
      (await calculateAccountEarnings(userID)) -
      (await calculateAccountPaidout(userID, "any"));
      
    let minimumPayout = (
      await ConfigDB.findOne({ name: "prototyping" }).select("minimumPayout")
    )?.minimumPayout;

    return {
      balance, 
      minimumPayout,
    };
  }
  if (user) {
    const userDB = await UserDB.findOne({
      email: user.email || user.user.email,
    });

    let balance =
      (await calculateAccountEarnings(userDB._id.toString())) -
      (await calculateAccountPaidout(userDB._id.toString(), "any"));
    let minimumPayout = (
      await ConfigDB.findOne({ name: "prototyping" }).select("minimumPayout")
    )?.minimumPayout;

    return {
      balance,
      minimumPayout,
    };
  }

  throw new Error("Unathorized");
}