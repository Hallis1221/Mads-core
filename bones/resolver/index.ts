import Ad from "../models/ad";
import { createAd, deleteAd, updateAd } from "./mutations/ad";
import { createData, deleteData, updateData, updateDataLimits } from "./mutations/data";
import { getAd, getAds } from "./queries/ad";
import { getAdData, getData} from "./queries/data";

const resolvers = {
  Query: {
    getAd,
    getAds,
    getAdData,
    getData
  },

  // TODO implement authentication for Mutation endpoints
  Mutation: {
    createAd,
    deleteAd,
    updateAd,
    createData,
    deleteData,
    updateData,
    updateDataLimits
  },
};

export default resolvers;
