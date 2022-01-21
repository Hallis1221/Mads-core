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

  // The history of the contentData
  history: {
    type: [
      {
        // The date the data is from
        date: {
          type: Date,
          required: true,
        },
        // The number of times the content had been clicked
        clicks: {
          type: Number,
          required: false,
        },

        // The number of times this content had been viewed
        views: {
          type: Number,
          required: false,
        },

        // The number of times this content had been skipped
        skips: {
          type: Number,
          required: false,
        },
      },
    ],
    required: false,
  },
});

const ContentData =
  mongoose.models.ContentData ||
  mongoose.model("ContentData", ContentDataSchema);

// EXPORTING OUR MODEL
export default ContentData;
