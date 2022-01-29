import { md5 } from "pure-md5";
import ApiDB from "../../db/models/auth/api";

// The authenticated function is used to check if the provided api key is valid.
export async function apiKeyAuthenticated(apiKey: string): Promise<boolean> {
  if (!apiKey) return false;

  // Hash the api key with md5
  const hash: string = md5(apiKey);

  // Get the api key from the DB
  const apiKeyDB: string | undefined = await ApiDB.findOne({ hash }).select(
    "hash"
  );

  // If the api key is not defined, return false
  if (!apiKeyDB) return false;

  // Double check that the api key is the same as the one in the DB
  if (apiKeyDB !== hash) return false;

  // If the api key is the same as the one in the DB, return true
  return true;
}
