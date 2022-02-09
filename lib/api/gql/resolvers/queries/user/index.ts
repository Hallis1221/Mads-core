import { isAuthorized } from "../../../../../auth/checks";
import { isCreator } from "../../../../../auth/checks/user";
import UserDB from "../../../../../db/models/auth/user";
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
