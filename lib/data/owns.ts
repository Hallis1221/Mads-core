import Content from "../mongodb/models/content";

// function that checks the owner of provided contentID
export default async function getOwner(
    contentID: string,
)
{
    let content = await Content.findOne({
        where: {
            id: contentID,
        },
    });
    if (!content) {
        throw new Error(`Content with id ${contentID} does not exist`);
    }
    return content.owner;
}