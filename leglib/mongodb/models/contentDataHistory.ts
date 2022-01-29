import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const ContentDataHistorySchema = new mongoose.Schema({
  // The contentID of the content associated with the contentData is used as the primary key
  contentID: {
    type: String,
    required: true,
  },

  // The date for this history entry
  date: {
    type: Date,
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

const ContentDataHistory =
  mongoose.models.ContentDataHistory ||
  mongoose.model("ContentDataHistory", ContentDataHistorySchema);

// EXPORTING OUR MODEL
export default ContentDataHistory;
