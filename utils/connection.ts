//IMPORT MONGOOSE
import mongoose, { Model } from "mongoose";

// CONNECTING TO MONGOOSE (Get Database Url from .env.local)
const { NEXT_PUBLIC_MONGO_DATABASE_URL } = process.env;

// connection function
export const connectDB = async () =>
  await mongoose
    .connect(NEXT_PUBLIC_MONGO_DATABASE_URL as string)
    .catch((err: any) => console.log(err));
console.log("Mongoose Connection Established");
