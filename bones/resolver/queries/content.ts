import { authenticated } from "../../auth";
import registerContentView from "../../data/registerConentView";
import Content from "../../models/content";

export async function getContent(_: any, { id }: any) {
  const content = await Content.findById(id);
  if (!content) {
    throw new Error("Content not found");
  }else {
    registerContentView(id);
  }
  return content;
}

export async function getContents(_ : any, { input } : any) {
  if (!authenticated(input["password"])) return null;
  try {
    const contents = await Content.find({});
    return contents;
  } catch (error) {
    console.error(error);
  }
}