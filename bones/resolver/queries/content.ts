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
