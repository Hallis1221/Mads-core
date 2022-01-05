// Schema for content. Similar to the ad schema.Includes a theme, a title, a link, tags, and an owner.

import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const ContentSchema = new mongoose.Schema({
    // The theme of the content. This is the content's "category"
    theme: {
        type: String,
        required: true,
    },

    // The content's user friendly title
    title: {
        type: String,
        required: true,
    },

    // The link users will go to when they skip the ad. In the future this will be a file 
    link: {
        type: String,
        required: true,
    },

    // Tags are used to filter content to be relevant to the ad shown. Without priority as that is only neccessary for the ad schema.
    tags: {
        type: [{
            tag: String,
        }],
        required: true,
    },

    // The "owner" of the content. This is the user who created the content
    owner: {
        type: {
            uid: String,
            displayName: String,
        },
        required: true,
    },
});

const Content = mongoose.models.Content || mongoose.model("Content", ContentSchema);
export default Content; 