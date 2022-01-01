import { createAd, deleteAd, updateAd } from "./mutations/ad";
import { createAdData, deleteAdData, updateAdData, updateAdDataLimits } from "./mutations/adData";
import { getAd, getAds } from "./queries/ad";
import { getAdData, getAdsData} from "./queries/adData";

const resolvers = {
  Query: {
    getAd,
    getAds,
    getAdData,
    getAdsData
  },

  // TODO implement authentication for Mutation endpoints
  Mutation: {
    createAd,
    deleteAd,
    updateAd,
    createAdData,
    deleteAdData,
    updateAdData,
    updateAdDataLimits
  },
};

export default resolvers;
