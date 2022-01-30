import ContentDB from "../../db/models/content";

export function getContent(id: string | string[] | undefined) {
  if (typeof id === "string") {
    const content = ContentDB.findById(id);

    // If the content does not exist, throw an error
    if (!content) throw new Error("Content does not exist.");

    return content;
  } else if (Array.isArray(id)) {
    const contents = ContentDB.find({ _id: { $in: id } });

    // If the content does not exist, throw an error
    if (!contents) throw new Error("Content does not exist.");

    return contents;
  } else {
    const contents = ContentDB.find({});

    // If the content does not exist, throw an error
    if (!contents) throw new Error("Content does not exist.");

    return contents;
  }
}

export function getUserContent(uid: string) {
  // TODO this approch might not work. Might have to get all the content and then filter it.
  const contents = ContentDB.find({
    owner: {
      uid: uid,
    },
  });

  // If the content does not exist, throw an error
  if (!contents) throw new Error("Content does not exist.");

  return contents;
}
