import { isAuthorized } from "../../../../../auth/checks";
import { User } from "../../../../../types/user";

// This is the resolver for the isCreator query. It takes in the userID and adID as its only argument and returns true if the user is a creator
export async function isCreatorQuery(
  _: undefined,
  { user }: { user: User }
): Promise<boolean> {
  if (user) {
    if (await isAuthorized("creator", user, undefined)) return true;
    return false;
  } else throw new Error("User is not defined");
}
