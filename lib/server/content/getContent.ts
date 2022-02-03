import ContentDB from "../../db/models/content";

export async function getContent(id: string | string[] | undefined) {
  if (typeof id === "string") {
    const content = await ContentDB.findById(id);
    // If the content does not exist, throw an error
    if (!content) throw new Error("Content does not exist.");

    return content;
  } else if (Array.isArray(id)) {
    const contents = await ContentDB.find({ _id: { $in: id } });

    // If the content does not exist, throw an error
    if (!contents) throw new Error("Content does not exist.");

    return contents;
  } else {
    const contents = await ContentDB.find({});

    // If the content does not exist, throw an error
    if (!contents) throw new Error("Content does not exist.");

    return contents;
  }
}

export async function getUserContent(uid: string) {
  // TODO surly this is not the best way to do this. Loads of DB reads


  // Select the owner and _id to not get the whole content, works better at scale
  let contents = await ContentDB.find({
    owner: {
      $exists: true,
    },
  })
    .select("owner")
    .select("_id");

  contents = contents.filter((content) => {
    return content.owner.uid === uid;
  });

  let userContents = await ContentDB.find({
    _id: {
      $in: contents.map((content) => {
        return content._id;
      }),
    },
  });

  // If the content does not exist, throw an error
  if (!userContents) throw new Error("Did not find any content");

  return userContents;
}


export async function getUserContentIDS(uid: string) {
  // TODO surly this is not the best way to do this. Loads of DB reads


  // Select the owner and _id to not get the whole content, works better at scale
  let contents = await ContentDB.find({
    owner: {
      $exists: true,
    },
  })
    .select("owner")
    .select("_id");

  contents = contents.filter((content) => {
    return content.owner.uid === uid;
  });

  let userContents = await ContentDB.find({
    _id: {
      $in: contents.map((content) => {
        return content._id;
      }),
    },
  }).select("_id");

  // If the content does not exist, throw an error
  if (!userContents) throw new Error("Did not find any content");

  return userContents;
}
