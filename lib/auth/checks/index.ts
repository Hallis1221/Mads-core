import { AuthLevels } from "../../types/auth/levels";
import { User } from "../../types/user";

// The function isAUtherized is used as a general, multi purpose function, it checks whether a user is authorized to perform a certain action with a given access level.
export async function isAuthorized(
  accessLevel: AuthLevels,
  authentication: User | string,
  context: {
    contentid: string | undefined;
  }
): Promise<boolean> {
  return;
}
