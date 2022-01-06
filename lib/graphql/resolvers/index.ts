import { createAd, deleteAd, updateAd } from "./mutations/ad";
import {
  createAdData,
  deleteAdData,
  updateAdData,
  updateAdDataLimits,
} from "./mutations/adData";
import { getAd, getAds } from "./queries/ad";
import { getAdData, getAdsData } from "./queries/adData";
import {
  createContent,
  deleteContent,
  updateContent,
} from "./mutations/content";
import { getContent, getContents } from "./queries/content";
import { getContentData } from "./queries/contentData";
import {
  createContentData,
  deleteContentData,
  updateContentData,
} from "./mutations/contentData";
import findAd from "./queries/findAd";
import { registerForCreatorWaitlist, getUserInfo } from "./mutations/waitlist";
import { registerViews, registerClicks } from "./mutations/data";

// This is a list of all the resolvers in our app, both queries and mutations.
// It is more readable to have the actual resolvers in a seperate file but they are referenced here in order to have it nice and tidy for our api endpoint.
const resolvers = {
  Query: {
    getAd,
    getAds,
    findAd,
    getAdData,
    getAdsData,
    getContent,
    getContents,
    getContentData,
    getUserInfo,
  },

  // TODO implement authentication for Mutation endpoints
  Mutation: {
    createAd,
    deleteAd,
    updateAd,
    createAdData,
    deleteAdData,
    updateAdData,
    updateAdDataLimits,
    createContent,
    deleteContent,
    updateContent,
    createContentData,
    deleteContentData,
    updateContentData,
    registerViews,
    registerClicks,
    registerForCreatorWaitlist,
  },
};

export default resolvers;
