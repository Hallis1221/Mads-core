import Content from "../../mongodb/models/content";
import ContentData from "../../mongodb/models/contentData";
import ContentDataHistory from "../../mongodb/models/contentDataHistory";

export async function cleanDB() {
  let contentIDS = (await Content.find({}).select("_id")).map((contentID) =>
    contentID._id.toString()
  );
  let contentDataIDS = (await ContentData.find({}).select("contentID")).map(
    (contentData) => contentData.contentID.toString()
  );

  // Expired content data is content data whos content is no longer in the database.
  let expiredContentData = contentDataIDS.filter(
    (contentID) => !contentIDS.includes(contentID)
  );

  // Delete expired content data
   await ContentData.deleteMany({contentID: {$in: expiredContentData}});

   // Delete the expired content data history
   await ContentDataHistory.deleteMany({contentID: {$in: expiredContentData}});
}
