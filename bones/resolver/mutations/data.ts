import AdData from "../../models/data";

export async function createData(_: any, { input }: any) {
  if (process.env.NODE_ENV === "production") {
    return null;
  }
  try {
    const data = new AdData(input);
    const newData = await data.save();

    return newData;
  } catch (error) {
    console.error(error);
  }
}

export async function updateDataLimits(_: any, { id, input }: any) {
  if (process.env.NODE_ENV === "production") {
    return null;
  }
  try {
    let ad = await AdData.findOne({ adID: id });
    if (!ad) {
      throw new Error("Data not found");
    }
    ad = await AdData.findOneAndUpdate(
      { adID: id },
      { $set: input },
      { new: true }
    );

    return ad;
  } catch (error) {
    console.error(error);
  }
}

export async function updateData(_: any, { id, input }: any) {
  if (process.env.NODE_ENV === "production") {
    return null;
  }
  try {
    let ad = await AdData.findOne({ adID: id });
    if (!ad) {
      throw new Error("Data not found");
    }
    ad = await AdData.findOneAndUpdate(
      { adID: id },
      { $set: input },
      { new: true }
    );

    return ad;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteData(_: any, { id }: any) {
  if (process.env.NODE_ENV === "production") {
    return null;
  }
  try {
    const ad = await AdData.findOne({ adID: id });
    if (!ad) {
      throw new Error("Data not found");
    }
    await AdData.findOneAndDelete({ adID: id });
    return "Data deleted";
  } catch (error) {
    console.error(error);
  }
}
