import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const ApiSchema = new mongoose.Schema({
    // The hash of the API key
    hash: {
        type: String,
        required: true,
    },

});

const ApiDB = mongoose.models.User || mongoose.model("User", ApiSchema);
export default ApiDB;