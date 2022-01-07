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

  // The max number of times the ad can be clicked / how many clicks have been paid for
  maxClicks: {
    type: Number,
    required: false,
  },

  // This number of times this ad has been viewed
  views: {
    type: Number,
    required: false,
  },


  // The max number of times this ad can be viewed / how many views have been paid for
  maxViews: {
    type: Number,
    required: false,
  },

  // The number of times this ad has been skipped
  skips: {
    type: Number,
    required: false,
  },

  // The start date of the ad. The campaign start. This is optional but can provide better analytics
  startDate: {
    type: String,
    required: false,
  },

    // The end date of the ad. The campaign end. This is optional
  endDate: {
    type: String!,
    required: false,
  },
});

const AdData = mongoose.models.AdData || mongoose.model("AdData", AdDataSchema);

// EXPORTING OUR MODEL
export default AdData;
