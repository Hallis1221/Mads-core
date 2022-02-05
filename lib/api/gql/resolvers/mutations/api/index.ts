import { createApiKey } from "../../../../../auth/api";
import { User } from "../../../../../types/user";

// The createCreatorKey mutation takes in no arguments but uses the user from the context to create a new API key. The function returns the api key.
export async function createCreatorKeyMutation(
    _: any,
    __: any,
  { user }: { user: User }
){
    let apiKey = await createApiKey(user?.id || "");
    return apiKey;
}