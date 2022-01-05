//IMPORT MONGOOSE
import mongoose from "mongoose";

// CONNECTING TO MONGOOSE (Get Database Url from .env.local)
const { MONGO_DATABASE_URL } = process.env;

// connection function
export const connectDB = async () =>
  // connect to mongoose using the url from .env.local
  await mongoose
    .connect(MONGO_DATABASE_URL as string)
    // catch any errors and log them
    .catch((err: any) => console.log(err));
console.log("Mongoose Connection Established");
