import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const AdDataSchema = new mongoose.Schema({

    adID: {
        type: String,
        required: true,
    },

    clicks: {
        type: Number,
        required: false,
    },

    maxClicks: {
        type: Number,
        required: false,
    },

    views: {
        type: Number,
        required: false,
    },

    maxViews: {
        type: Number,
        required: false,
    },
    
    startDate: {
        type: String,
        required: false,
    },

    endDate: {
        type: String!,
        required: false,
    },
});

const AdData = mongoose.models.AdData || mongoose.model("AdData", AdDataSchema);

// EXPORTING OUR MODEL
export default AdData;
