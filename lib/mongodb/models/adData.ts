import mongoose from "mongoose";
import historyPlugin from "../plugins/history/mongoose-history.js";
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
});


var options = {
  metadata: [
    {key: 'adID', value: 'adID'},
    {key: 'clicks', value: 'clicks'},
    {key: 'views', value: 'views'},
    {key: 'skips', value: 'skips'},
    {key: 'd', value: undefined},
  ]
};
AdDataSchema.plugin(historyPlugin, options);

const AdData = mongoose.models.AdData || mongoose.model("AdData", AdDataSchema);

// EXPORTING OUR MODEL
export default AdData;