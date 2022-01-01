import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const ContentDataSchema = new mongoose.Schema({

    contentID: {
        type: String,
        required: true,
    },

    clicks: {
        type: Number,
        required: false,
    },

    views: {
        type: Number,
        required: false,
    },

    uploadDate: {
        type: String!,
        required: false,
    },
});

const ContentData = mongoose.models.ContentData || mongoose.model("ContentData", ContentDataSchema);

// EXPORTING OUR MODEL
export default ContentData;
