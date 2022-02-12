import UserDB from "../../db/models/auth/user";
import { logger } from "../../log";
import { User } from "../../types/user";
import calculateAccountEarnings from "../currency/calculateEarnings";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function defaultUser(userID: string): Promise<User> {
  let user = await UserDB.findOne({ userID });

  if (!user) throw new Error(`User with id: ${userID} not found`);

  if (!user.creator)
    await UserDB.updateOne({ email: user.email }, { creator: false });

  logger.debug(`Defaulted user: ${user.email} to creator: ${user.creator}`);
  return user;
}

export async function getUserStripeID(userID: string): Promise<string> {
  let user = await UserDB.findById(userID);

  if (!user._id) throw new Error(`User with id: ${userID} not found`);
  if (!user.stripeID)
    throw new Error(`User with id: ${userID} has no stripeID`);
  return user.stripeID;
}

export async function createUserStripeID(userID: string): Promise<string> {
  let user = await UserDB.findOne({ userID });

  if (!user._id) throw new Error(`User with id: ${userID} not found`);
  if (user.stripeID)
    throw new Error(
      `User with id: ${userID} already has a stripeID. Call getUserStripeID to get the stripeID`
    );

  const account = await stripe.accounts.create({
    type: "express",
  });

  await UserDB.findByIdAndUpdate(userID, { stripeID: account.id });

  logger.debug(`Created user: ${user.email} stripeID: ${account.id}`);

  return await getUserStripeID(userID);
}

export async function getStripeOnboardingLink(
  stripeID: string
): Promise<string> {
  const accountLink = await stripe.accountLinks.create({
    account: stripeID,
    refresh_url: process.env.NEXTAUTH_URL + "/creator/dashboard/payments",
    return_url:process.env.NEXTAUTH_URL + "/creator/dashboard/payments",
    type: "account_onboarding",
  }).catch((err: string | undefined) => {
    logger.error(err);
    throw new Error(err);
  });

  console.log(await calculateAccountEarnings("61d9b6381c6d7f252221fe55"))
  return accountLink.url;
}
