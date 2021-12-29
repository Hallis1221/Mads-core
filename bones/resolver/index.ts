import Ad from "../models/ad";
import { adQueries } from "./queries/ad";

const resolvers = {
  Query: {
...adQueries
  },

  // TODO implement authentication for Mutation endpoints
  Mutation: {
    createAd: async (_: any, { input }: any) => {
      if (  process.env.NODE_ENV === "production"){
        return null;
      }
      try {
        const ad = new Ad(input);
        const newAd = await ad.save();

        return newAd;
      } catch (error) {
        console.error(error);
      }
    },

    updateAd: async (_: any, { id, input }: any) => {
      if (  process.env.NODE_ENV === "production"){
        return null;
      }
      try {
        let ad = await Ad.findById(id);
        if (!ad) {
          throw new Error("Ad not found");
        }
        ad = await Ad.findByIdAndUpdate(id, { $set: input }, { new: true });
        
        return ad;
      } catch (error) {
        console.error(error);
      }
    },

    deleteAd: async (_: any, { id }: any) => {
      if (  process.env.NODE_ENV === "production"){
        return null;
      }
      try {
        const ad = await Ad.findById(id);
        if (!ad) {
          throw new Error("Ad not found");
        }
        await Ad.findByIdAndDelete(id);
        return "Ad deleted";
      } catch (error) {
        console.error(error);
      }
    },
  },
};

export default resolvers;
