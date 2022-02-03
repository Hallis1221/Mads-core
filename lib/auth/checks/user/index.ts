// Function that checks if the provided user is a creator. Returns true if the user is a creator, false if not.

import ContentDB from "../../../db/models/content";
import UserDB from "../../../db/models/auth/user";
import { User } from "../../../types/user";

// The isCreator function is used to provide a short hand for selecting the user from the DB and getting the creator field.
export async function isCreator(email: string): Promise<boolean> {
  // Get the user with the provided email and select the creator field
  const creator: boolean | undefined = (await UserDB.findOne({ email }).select(
    "creator"
  ))?.creator;

  // If the creator is defined, return the creator value, else return false
  return creator ? creator : false;
}

// The isOwner function is used to provide a short hand for selecting the content from the DB and getting the owner field and then comparing it to the provided user.
export async function isContentOwner(user: User, contentID: string): Promise<boolean> {
  // If the user is not defined, return false
  if (!user) return false;

  // Get the content with the provided id and select the owner field
  const owner: string | undefined = (await ContentDB.findOne({
    _id: contentID,
  }).select("owner"))?.owner;

  // If the owner is not defined, return false
  if (!owner) return false;

  // If the provided user does not have ID defined, get the users id.
  if (!user.id) (await UserDB.findOne({ email: user.email }).select("_id"))?._id;

  // If the owner is equal to the users id, return true, else return false
  return owner === user.id;
}

export async function isAdmin(email: string): Promise<boolean> {
  throw new Error("Function not implemented.");
}
