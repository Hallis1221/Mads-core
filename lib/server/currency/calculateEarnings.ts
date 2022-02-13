import PaymentsDB from "../../db/currency/payments";
import UserDB from "../../db/models/auth/user";
import ConfigDB from "../../db/models/config";
import ContentDB from "../../db/models/content";
import { Content } from "../../types/content";
import { ContentData } from "../../types/data/contentData";
import { getUserContentData } from "../content/data/getContentData";

export default async function calculateAccountEarnings(
    userID: string,
){
    let prices = (await ConfigDB.findOne({
        name: "prototyping"
    }).select("prices"))?.prices;

    if (!prices) throw new Error("No prices found");
    
    // Get the user's content data
    const userContent: any= await getUserContentData(userID);

    // Store totals for views and clicks
    let totalViews = 0;
    let totalClicks = 0;
    
    // Iterate through the user's content
    for (var content of userContent) {

        content = content[0] as ContentData;

        // Add the content's views to the total
        totalViews += content.views || 0;

        // Add the content's clicks to the total
        totalClicks += content.clicks || 0;
    }
        
    // Calculate the earnings
    const earnings = (totalClicks  * prices.click) + (totalViews  * prices.view);

    return earnings;
}

export async function calculateAccountPaidout(
    userID: string,
    type: string,
){
    if (type === "any"){
        let paidout = 0;
        const payments = await PaymentsDB.find({
        status: "complete" || "pending",
            userID
        });
        for (var payment of payments){
            paidout += payment.amount;
        }
        return paidout;
    }

    let payments = (await PaymentsDB.find({
        userID: userID,
        status: "complete" || "pending",
        type: type,
    }).select("amount"));

    let total = 0;

    for (var payment of payments) {
        total += payment.amount;
    }
    
    return total;

}