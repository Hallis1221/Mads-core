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

const resolvers = {
  Query: {
    getAd,
    getAds,
    getAdData,
    getAdsData,
    getContent,
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
  },
};

export default resolvers;
