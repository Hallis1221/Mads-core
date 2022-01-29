// This approch differs from the one in db\connect\mongoose\connect.ts in that it uses mongodb instead of mongoose. This is because mongoose is not compatible with nextauth.

// Import MongoClient from mongodb
import { MongoClient } from "mongodb";
import { mongoClientOptions } from "../../config/db";

// Declare global variables to be used with type checking
declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

// Get the MONGO_DATABASE_URL environment variable
const uri = process.env.MONGO_DATABASE_URL;

// Sync function to connect to MongoDB. This function is exported.
export default function clientPromise(): Promise<MongoClient> {
  // If the MONGO_DATABASE_URL environment variable is not set, throw an error
  if (!uri) throw new Error("Please add your Mongo URI to .env.local");

  let client: MongoClient;
  let clientPromise: Promise<MongoClient>;

  // In development mode, use a global variable so that the value is preserved between hot reloads
  if (process.env.NODE_ENV === "development") {
    // If the global variable is not set, set it
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, mongoClientOptions);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode, it is best to not use a global variable
    client = new MongoClient(uri, mongoClientOptions);
    clientPromise = client.connect();
  }

  // Console log a message to let the user know that the app has given out a clientPromise
  console.log("Giving out a clientPromise...");

  // Return the connection
  return clientPromise;
}
