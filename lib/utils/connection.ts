//IMPORT MONGOOSE
import mongoose from "mongoose";

// TODO - add mongoose options

// CONNECTING TO MONGOOSE (Get Database Url from .env.local)
const { MONGO_DATABASE_URL } = process.env;
// connection function
const connectDB = async () =>
  // connect to mongoose using the url from .env.local
  await mongoose
    .connect(MONGO_DATABASE_URL as string)
    // catch any errors and log them
    .catch((err: any) => console.log(err));
console.log("Mongoose Connection Established");

export const connectIfReady: Function = async () => {
  if (
    mongoose.connection.readyState === 0 ||
    mongoose.connection.readyState === 3
  ) {
    console.log("Not Connected, Connecting...");
    await connectDB();
  }
};
