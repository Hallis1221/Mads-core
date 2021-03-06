import { AuthLevels } from "../../types/auth/levels";
import { User } from "../../types/user";
import { apiKeyAuthenticated, apiKeyLevel } from "../api";
import { isAdmin, isContentOwner, isCreator } from "./user";

// The function isAuthorized is used as a general, multi purpose function, it checks whether a user is authorized to perform a certain action with a given access level.
export async function isAuthorized(
  accessLevel: AuthLevels | undefined,
  authentication: User | string | undefined,
  context: {
    contentid: string | undefined;
  }
): Promise<boolean> {
  // If the accesslevel is none, return true
  // TODO implement rate limiting
  if (accessLevel === "none") return true;

  // If the access level is not defined, throw an error
  if (!accessLevel) throw new Error("Access level is undefined");

  // If the authentication is not defined, throw an error
  if (!authentication) throw new Error("Authentication is undefined");

  // If a api key is provided as the authentication and the key is valid, for now give the user access to everything.
  // TODO add api levels when the api becomes public

  let apilevel;
  if (typeof authentication === "string")
    apilevel = await apiKeyLevel(authentication as string);

  if (apilevel) {
    switch (apilevel) {
      case "admin":
        return true;
      case "creator":
        if (accessLevel === "creator") return true;

      case "user":
        if (accessLevel === "user") return true;

      default:
        return false;
        break;
    }
  }
  // If the access level is admin, check if a user is provided in the context, if not, throw an error
  // Then check if an email is provided in the user, if not, throw an error
  // Then check if the user is an admin

  if (typeof authentication !== "object")
    throw new Error(
      "Apikey was provided as the sole authentication method, but was invalid."
    );

  if (accessLevel === "admin") {
    if (!authentication) throw new Error("User is undefined");
    else if (!authentication.email) throw new Error("User email is undefined");
    else if (await isAdmin(authentication.email)) return true;
  }
  if (!authentication.email && authentication.user.email)
    authentication.email = authentication.user.email;

  // If the access level is user, check if a user is provided in the context, if not, throw an error
  if (accessLevel === "user") {
    if (!authentication) throw new Error("User is undefined");
    else if (authentication.email && authentication.email) return true;
    else throw new Error("Some of the properties on user is undefined");
  }

  // If the access level is creator, check if a user is provided in the context, if not, throw an error
  // Then check if an email is provided in the user, if not, throw an error
  // Then check if the user is a creator

  if (accessLevel === "creator") {
    if (!authentication) throw new Error("User is undefined");
    if (!authentication.email) throw new Error("User email is undefined");
    else if (await isCreator(authentication.email)) return true;
    else throw new Error("User is not a creator");
  }

  // If the access level is owner, check if a user is provided in the context, if not, throw an error
  // Then check if an email is provided in the user, if not, throw an error
  // Then check if a content id is provided in the context, if not, throw an error
  // Then check if the user is the owner of the content

  if (accessLevel === "owner") {
    if (!authentication) throw new Error("User is undefined");
    else if (!authentication.email) throw new Error("User email is undefined");
    else if (!context.contentid) throw new Error("Content id is undefined");
    else if (await isContentOwner(authentication, context.contentid))
      return true;
    else throw new Error("User is not the owner of the content");
  }

  return false;
}
