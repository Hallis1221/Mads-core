import Ad from "../../models/ad";

export const adQueries = {
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
};
