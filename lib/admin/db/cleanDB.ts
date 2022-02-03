// Import db models
import ContentDB from "../../db/models/content";
import ContentDataDB from "../../db/models/content/data";
import ContentDataHistoryDB from "../../db/models/content/history";

// Function that goes trough the content database and removes content that no longer has a content counterpart in the content database.
export async function removeOldContent() {
    // Get all the _ids of all the content in the content database
    let contentIDS: string[] = (await ContentDB.find({})).map((content) => content._id.toString());

    // Get all the _ids of all the contentData in the contentData database
    let contentdataIDS: string[] = (await ContentDataDB.find({}).select("contentID")).map((contentdata) => contentdata.contentID.toString());

    // "Old content" is the content that is in the contentData database but not in the content database
    let oldContent: string[] = contentdataIDS.filter((contentID: string) => !contentIDS.includes(contentID));

    // Remove all the contentData that is not in the content database from the contentData database
    await ContentDataDB.deleteMany({ contentID: { $in: oldContent } });

    // remove all the contentData that is not in the content database from the contentData history database
    await ContentDataHistoryDB.deleteMany({ contentID: { $in: oldContent } });
}