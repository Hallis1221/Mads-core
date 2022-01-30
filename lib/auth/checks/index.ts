import { AuthLevels } from "../../types/auth/levels";
import { User } from "../../types/user";
import { apiKeyAuthenticated } from "../api";
import { isAdmin, isContentOwner, isCreator } from "./user";

// The function isAUtherized is used as a general, multi purpose function, it checks whether a user is authorized to perform a certain action with a given access level.
export async function isAuthorized(
  accessLevel: AuthLevels | undefined,
  authentication: User | string | undefined,
  context: {
    contentid: string | undefined;
    user: User | undefined;
  }
): Promise<boolean> {
  // If the access level is not defined, throw an error
  if (!accessLevel) throw new Error("Access level is undefined");

  // If the authentication is not defined, throw an error
  if (!authentication) throw new Error("Authentication is undefined");

  // If the accesslevel is none, return true
  if (accessLevel === "none") return true;

  // If a api key is provided as the authentication and the key is valid, for now give the user access to everything.
  // TODO add api levels when the api becomes public

  if (typeof authentication === "string")
    if (await apiKeyAuthenticated(authentication)) return true;

  // If the access level is admin, check if a user is provided in the context, if not, throw an error
  // Then check if an email is provided in the user, if not, throw an error
  // Then check if the user is an admin

  if (accessLevel === "admin") {
    if (!context.user) throw new Error("User is undefined");
    else if (!context.user.email) throw new Error("User email is undefined");
    else if (await isAdmin(context.user.email)) return true;
  }

  // If the access level is user, check if a user is provided in the context, if not, throw an error
  if (accessLevel === "user") {
    if (!context.user) throw new Error("User is undefined");
    else if (context.user.email && context.user.email) return true;
    else throw new Error("Some of the properties on user is undefined");
  }

  // If the access level is creator, check if a user is provided in the context, if not, throw an error
  // Then check if an email is provided in the user, if not, throw an error
  // Then check if the user is a creator

  if (accessLevel === "creator") {
    if (!context.user) throw new Error("User is undefined");
    if (!context.user.email) throw new Error("User email is undefined");
    else if (await isCreator(context.user.email)) return true;
    else throw new Error("User is not a creator");
  }

  // If the access level is owner, check if a user is provided in the context, if not, throw an error
  // Then check if an email is provided in the user, if not, throw an error
  // Then check if a content id is provided in the context, if not, throw an error
  // Then check if the user is the owner of the content

  if (accessLevel === "owner") {
    if (!context.user) throw new Error("User is undefined");
    else if (!context.user.email) throw new Error("User email is undefined");
    else if (!context.contentid) throw new Error("Content id is undefined");
    else if (await isContentOwner(context.user, context.contentid)) return true;
    else throw new Error("User is not the owner of the content");
  }
}
