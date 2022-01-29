import { createAd, deleteAd, updateAd } from "./mutations/ad";
import {
  addAdDataMatch,
  createAdData,
  deleteAdData,
  updateAdData,} from "./mutations/adData";
import { getAd, getAds } from "./queries/ad";
import { getAdData, getAdsData } from "./queries/adData";
import {
  createContent,
  deleteContent,
  updateContent,
  userCreateContent,
} from "./mutations/content";
import { getContent, getContents, getUserContent } from "./queries/content";
import { getContentData } from "./queries/contentData";
import {
  createContentData,
  deleteContentData,
  updateContentData,
} from "./mutations/contentData";
import findAd from "./queries/findAd";
import { registerForCreatorWaitlist, getUserInfo } from "./mutations/waitlist";
import { registerViews, registerClicks, registerSkips } from "./mutations/data";
import { checkAndDefaultUser, isCreator } from "./queries/user";
import { getContentMonthHistory, getComperableContentHistory, getUserContentPerformances } from "./queries/data";

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
    checkAndDefaultUser,
    getUserContent,
    isCreator,
    getUserContentPerformances,
    getContentMonthHistory,
    getComperableContentHistory
  },

  // TODO implement authentication for Mutation endpoints
  Mutation: {
    createAd,
    deleteAd,
    updateAd,
    createAdData,
    deleteAdData,
    updateAdData,
    createContent,
    deleteContent,
    updateContent,
    createContentData,
    userCreateContent,
    deleteContentData,
    updateContentData,
    registerViews,
    registerClicks,
    registerSkips,
    registerForCreatorWaitlist,
    addAdDataMatch, 
  },
};

export default resolvers;