import ContentDB from "../../db/models/content";

export default async function validateContent(
  contentID: string | undefined,
  title: string,
  link: string,
  tags: string[],
  operation: "create" | "update"
) {
  if (operation === "update") {
      if (!contentID) throw new Error("Content ID is required for updates");
    let content = await ContentDB.findById(contentID);
    if (!content)
      throw new Error(`Content with id ${contentID} does not exist`);

    if (
      content.title === title &&
      content.link === link &&
      content.tags === tags
    )
      throw new Error(
        `Content with id ${contentID} has not been updated. No new data was provided`
      );
  }

  if (title.length >= 50) throw new Error("Title is too long");
  if (link.length >= 100) throw new Error("Link is too long. Limit at 100 characters");
  if (tags.length > 5) throw new Error("You can only have 5 tags");

  return;
}
