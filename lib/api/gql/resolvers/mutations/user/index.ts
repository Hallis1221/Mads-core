import UserDB from "../../../../../db/models/auth/user";
import { logger } from "../../../../../log";
import { User } from "../../../../../types/user";

// This is the resolver for the defualtUser mutation.
export default async function defaultUserMutation(
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
