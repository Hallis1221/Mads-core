import { isAuthorized } from "../../../../../auth/checks";
import ApiDB from "../../../../../db/models/auth/api";
import UserDB from "../../../../../db/models/auth/user";
import { logger } from "../../../../../log";
import { createUserStripeID } from "../../../../../server/user";
import { User } from "../../../../../types/user";

// This is the resolver for the defualtUser mutation.
export async function defaultUserMutation(
  _: undefined,
  { userID }: { userID: string }
): Promise<User> {
  let user = await UserDB.findOne({ userID });

  if (!user) throw new Error(`User with id: ${userID} not found`);

  if (!user.creator) {
    await UserDB.updateOne({ email: user.email }, { creator: false });

   logger.debug(`Defaulted user: ${user.email} to creator: false`);
  }

  return user;

}

// This is the resolver for the createUserStripeID mutation.
export async function createUserStripeIDMutation(
  _: undefined,
  { apiKey }: { apiKey: string },
  { user }: { user: User },
): Promise<string> {
  if (apiKey) {
    if (!(await isAuthorized("creator", apiKey, { contentid: undefined })))
      throw new Error("API key is not authorized as creator");

    // Get the user id from the api key
    let userID: string | undefined = (await ApiDB.findOne({ apiKey })).userID;

    if (!userID) throw new Error("API key is not associated with a user");

    return await createUserStripeID(userID);
  }
  if (user) {
    const userDB = await UserDB.findOne({ email: user.email });
    return createUserStripeID(userDB._id);
  }

  throw new Error("Unathorized");
}