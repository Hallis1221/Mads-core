import { authenticated } from "../../auth";
import Content from "../../models/content";

export async function createContent(_: any, { input }: any) {
  if (process.env.NODE_ENV === "production" && !authenticated) return null;

  try {
    const content = new Content(input);
    const newContent = await content.save();

    return newContent;
  } catch (error) {
    console.error(error);
  }
}

export async function updateContent(_: any, { id, input }: any) {
  if (process.env.NODE_ENV === "production" && !authenticated) return null;

  try {
    let content = await Content.findById(id);
    if (!content) {
      throw new Error("Content not found");
    }
    content = await Content.findByIdAndUpdate(
      id,
      { $set: input },
      { new: true }
    );

    return content;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteContent(_: any, { id }: any) {
  if (process.env.NODE_ENV === "production" && !authenticated) return null;

  try {
    const content = await Content.findById(id);
    if (!content) {
      throw new Error("Content not found");
    }
    await Content.findByIdAndDelete(id);
    return "Content deleted";
  } catch (error) {
    console.error(error);
  }
}
