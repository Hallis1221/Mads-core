import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const UserSchema = new mongoose.Schema({
  // The users name, nullable
  name: {
    type: String,
    required: false,
  },

  // The users email
  email: {
    type: String,
    required: true,
  },

  // The users image, nullable
  image: {
    type: String,
    required: false,
  },

  // If the users email is verified, nullable
  verified: {
    type: Boolean,
    required: false,
  },

  // If the user is a creator, nullable
  creator: {
    type: Boolean,
    required: false,
  },

  // If the user is an admin, nullable
  admin: {
    type: Boolean,
    required: false,
  },
});

const UserDB = mongoose.models.User || mongoose.model("User", UserSchema);
export default UserDB;
