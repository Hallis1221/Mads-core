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
import { getContent } from "./queries/content";
import { getContentData } from "./queries/contentData";
import {
  createContentData,
  deleteContentData,
  updateContentData,
} from "./mutations/contentData";

const resolvers = {
  Query: {
    getAd,
    getAds,
    getAdData,
    getAdsData,
    getContent,
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
  },
};

export default resolvers;
