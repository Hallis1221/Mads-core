// This is the model for the configuration object. 

import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const ConfigSchema = new mongoose.Schema({
    // The name of the configuration object
    name: {
        type: String,
        required: true,
    },

    // The prices for advertisments
    prices: {
        type: {
            // The price for a view
            view: {
                type: Number,
                required: true,
            },

            // The price for a click
            click: {
                type: Number,
                required: true,
            },
        }
    },

    // Platform fees
    platformFees: {
        type: {
            // The platform fee for advertisers
            advertiser: {
                type: Number,
                required: true,
            },

            // The platform fee for creators
            creator: {
                type: Number,
                required: true,
            },
        }
    },

    // Minimum payout amount
    minimumPayout: {
        type: Number,
        required: true,
    },

});

const ConfigDB = mongoose.models.Config || mongoose.model("Config", ConfigSchema);  
export default ConfigDB;