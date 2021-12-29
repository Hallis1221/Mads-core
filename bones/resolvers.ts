import Ad from "./models/ad";

const resolvers = {
  Query: {
    getAds: async () => {
      try {
        const ads = await Ad.find({});
        return ads;
      } catch (error) {
        console.error(error);
      }
    },

    getAd: async (_: any, { id }: any) => {
      const ad = await Ad.findById(id);
      if (!ad) {
        throw new Error("Ad not found");
      }
      return ad;
    },
  },
  Mutation: {
    createAd: async (_: any, { input }: any) => {
      try {
        const ad = new Ad({ input });
        const newAd = await ad.save();

        return newAd;
      } catch (error) {
        console.error(error);
      }
    },

    updateAd: async (_: any, { id, input }: any) => {
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
    }
  },
};

export default resolvers;
