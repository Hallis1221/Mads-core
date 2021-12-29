import mongoose from "mongoose";

mongoose.Promise = global.Promise;

// OUR TODO SCHEMA
const AdSchema = new mongoose.Schema({
  // The type of ad, e.g. "image" or "video"
  type: {
    type: String,
    required: true,
  },

  // The "theme". This is the ad's "category"
  theme: {
    type: String,
    required: true,
  },

  // The ad's user friendly title
  title: {
    type: String,
    required: true,
  },

  // The link users will go to when they click on the ad
  link: {
    type: String,
    required: true,
  },

  // If the ad has type "image", this is the image's URL
  image: {
    type: String,
    required: false,
  },

  // Tags are used to filter ads to be relevant to the content
  tags: {
    // The lower the number, the higher the priority. High priority tags are the most likely to be matched with a content.
    type: [{
      tag: String,
      priority: Number,
    }],
    required: true,
  },

  // The "owner" of the ad. This is the user who created the ad
  owner: {
    type: {
      uid: String,
      displayName: String,
    },
    required: true,
  },
});

// OUR TODO MODEL
const Ad = mongoose.models.Ad || mongoose.model("Ad", AdSchema);

// EXPORTING OUR MODEL
export default Ad;
