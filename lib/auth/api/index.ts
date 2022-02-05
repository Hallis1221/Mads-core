import { md5 } from "pure-md5";
import { apiiKeyCharacters, apiKeyLength } from "../../config/auth";
import ApiDB from "../../db/models/auth/api";
import UserDB from "../../db/models/auth/user";
import { logger } from "../../log";

export const apiKey = process.env.API_KEY || "";

// The authenticated function is used to check if the provided api key is valid.
export async function apiKeyAuthenticated(apiKey: string): Promise<boolean> {
  if (!apiKey) return false;

  // Hash the api key with md5
  const hash: string = md5(apiKey);

  // Get the api key from the DB
  const apiKeyDB: {
    hash: string | undefined;
  } = await ApiDB.findOne({ hash }).select("hash");

  // If the api key is not defined, return false
  if (!apiKeyDB?.hash) return false;
  // Double check that the api key is the same as the one in the DB
  if (apiKeyDB.hash !== hash) return false;

  // If the api key is the same as the one in the DB, return true
  return true;
}

// The createApiKey function is used to create a new api key, hash it, save it to the DB and return the api key.
export async function createApiKey(userID: string): Promise<string> {
  logger.warn("Creating new api key for userID: " + userID);

  // Check if the userID is valid
  if (!userID) throw new Error("UserID is not valid");

  let user = await UserDB.findById(userID);
  if (!user) throw new Error("UserID is not valid");

  if (!user.creator)
    throw new Error("Sorry! At this time, only creators can create api keys");

  // Create a new api key
  let apiKey: string | undefined = "";

  // Loop trough every number from 0 to the max number of characters in the api key
  for (var i = 0, n = apiiKeyCharacters.length; i < apiKeyLength; ++i) {
    // Get a random number from 0 to the max number of characters in the api key
    const randomNumber: number = Math.floor(Math.random() * n);

    // Add the random number to the api key
    apiKey += apiiKeyCharacters[randomNumber];
  }

  // Check that the apikey is defined
  if (!apiKey) throw new Error("Api key is undefined");

  // Check that the api key is not longer than the max length
  if (apiKey.length > apiKeyLength) throw new Error("Api key is too long");

  // Hash the api key with md5
  const hashedApiKey: string = md5(apiKey);

  // Save the api key to the DB
  let newDBEntry = await ApiDB.create({ hash: hashedApiKey });

  // Return the api key
  logger.warn("Created new api key with hash: " + newDBEntry.hash);
  return apiKey;
}
