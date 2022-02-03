import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const ContentDataSchema = new mongoose.Schema({
  // The contentID of the content associated with the contentData is used as the primary key
  contentID: {
    type: String,
    required: true,
  },

  // The number of times the content has been clicked
  clicks: {
    type: Number,
    required: false,
  },

  // The number of times this content has been viewed
  views: {
    type: Number,
    required: false,
  },

  // The number of times this content has been skipped
  skips: {
    type: Number,
    required: false,
  },
});

const ContentDataDB =
  mongoose.models.ContentData ||
  mongoose.model("ContentData", ContentDataSchema);

// EXPORTING OUR MODEL
export default ContentDataDB;
