import mongoose from "mongoose";
mongoose.Promise = global.Promise;

const AdDataSchema = new mongoose.Schema({
  // The adID of the ad associated with the adData is used as the primary key
  adID: {
    type: String,
    required: true,
  },

  // The number of times the ad has been clicked
  clicks: {
    type: Number,
    required: false,
  },

  // This number of times this ad has been viewed
  views: {
    type: Number,
    required: false,
  },

  // The number of times this ad has been skipped
  skips: {
    type: Number,
    required: false,
  },

  // How much has been paid for this ad
  paid: {
    type: {
      clicks: Number,
      views: Number,
    },
    required: false,
  },

  matches: {
    type: [
      {
        // The contentID of the content that matched this ad
        contentID: String,
        begins: Date,
        ends: Date,
      }
    ],
  }
});

const AdDataDB = mongoose.models.AdData || mongoose.model("AdData", AdDataSchema);

// EXPORTING OUR MODEL
export default AdDataDB;
