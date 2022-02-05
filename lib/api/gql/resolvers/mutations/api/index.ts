import { createApiKey } from "../../../../../auth/api";
import ApiDB from "../../../../../db/models/auth/api";
import UserDB from "../../../../../db/models/auth/user";
import { User } from "../../../../../types/user";

// The createCreatorKey mutation takes in no arguments but uses the user from the context to create a new API key. The function returns the api key.
export async function createCreatorKeyMutation(
  _: any,
  __: any,
  { user }: { user: User }
) {
  let userid = (await UserDB.findOne({ email: user.user.email }).select("id")).id;
  if (!userid) throw new Error("User not found");

  // Check how many keys the user has
  let keys = await ApiDB.find({ userID: userid });
  if (keys.length >= 5) throw new Error("At the moment, you can only have 5 keys. If you need more or have forgotten all of them, please contact us.");

  let apiKey = await createApiKey(userid);
  return apiKey;
}
