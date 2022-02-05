import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const ApiSchema = new mongoose.Schema({
    // The hash of the API key
    hash: {
        type: String,
        required: true,
    },

    userID: {
        type: String,
    }

});

const ApiDB = mongoose.models.ApiKeys || mongoose.model("ApiKeys", ApiSchema);
export default ApiDB;