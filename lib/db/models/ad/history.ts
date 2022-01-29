import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const AdDataHistorySchema = new mongoose.Schema({
  // The contentID of the content associated with the contentData is used as the primary key
  adID: {
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

const AdDataHistoryDB =
  mongoose.models.AdDataHistory ||
  mongoose.model("AdDataHistory", AdDataHistorySchema);

// EXPORTING OUR MODEL
export default AdDataHistoryDB;
