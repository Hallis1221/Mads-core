import { isAuthorized } from "../../../../../auth/checks";
import { isCreator } from "../../../../../auth/checks/user";
import ApiDB from "../../../../../db/models/auth/api";
import UserDB from "../../../../../db/models/auth/user";
import calculateAccountEarnings from "../../../../../server/currency/calculateEarnings";
import { getStripeOnboardingLink, getUserStripeID } from "../../../../../server/user";
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
    const userDB = await UserDB.findOne({ email: user.email || user.user.email });
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
    const userDB = await UserDB.findOne({ email: user.email || user.user.email });
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
    const userDB = await UserDB.findOne({ email: user.email || user.user.email });
    return await calculateAccountEarnings(userDB._id.toString());
  }

  throw new Error("Unathorized");
}