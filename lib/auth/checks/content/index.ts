import { User } from "../../../types/user";
import { isCreator, isContentOwner } from "../user";

// The permittedToGetContent function is used to check if a user is permitted to get content with a given id.
export async function permittedToGetContent(
  user: User,
  contentID: string
): Promise<boolean> {
  if (!user) return false;

  // Check if the user is a creator, if not return false
  if (!(await isCreator(user.email))) return false;

  // Check if the user owns the content, if not return false
  if (!(await isContentOwner(user, contentID))) return false;

  // If the user is a creator and owns the content, return true
  return true;
}

// The permittedToCreateContent function is used to check if a user is permitted to create content.
export async function permittedToCreateContent(user: User): Promise<boolean> {
  if (!user) return false;

  // Check if the user is a creator, if not return false
  if (!(await isCreator(user.email))) return false;

  // If the user is a creator, return true
  return true;
}
