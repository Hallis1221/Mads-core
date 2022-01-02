import { createAd, deleteAd, updateAd,  } from "./mutations/ad";
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
import { registerViews } from "./mutations/data";

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
  },
};

export default resolvers;
