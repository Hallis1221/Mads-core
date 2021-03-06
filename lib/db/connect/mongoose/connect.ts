// Import mongoose
import mongoose from "mongoose";
import { mongooseConnectOptions } from "../../../config/db";
import { logger } from "../../../log";

// Get the MONGO_DATABASE_URL environment variable
const uri = process.env.MONGO_DATABASE_URL;

// Async function to connect to MongoDB. This function is exported.
export default async function connectDB(): Promise<mongoose.Connection> {
  let dblog = logger.startTimer();
  // If the MONGO_DATABASE_URL environment variable is not set, throw an error
  if (!uri) throw new Error("Please add your Mongo URI to .env.local");

  // Check if the connection is already established
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  // throw new Error("DB is already connected");

  // Console log a message to let the user know that the app is attempting to connect to MongoDB
  logger.info("Connecting to MongoDB...");

  // Connect to MongoDB
  await mongoose.connect(uri, mongooseConnectOptions);

  // Console log a success message to let the user know that the app is connected to MongoDB
  logger.info("Connected to MongoDB!");
  dblog.done({
    message: "Connected to DB",
  });

  // Return the connection
  return mongoose.connection;
}
