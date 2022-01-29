// Import MongoClientOptions from mongodb
import { MongoClientOptions } from "mongodb";

// Import mongoose
import mongoose from "mongoose";

// Export mongodb options
export const mongoClientOptions: MongoClientOptions = {
  maxPoolSize: 10,
};

export const mongooseConnectOptions: mongoose.ConnectOptions = {
  maxPoolSize: 10,
};
