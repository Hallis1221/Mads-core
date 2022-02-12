import PaymentsDB from "../../db/currency/payments";
import UserDB from "../../db/models/auth/user";
import ContentDB from "../../db/models/content";
import { Content } from "../../types/content";
import { ContentData } from "../../types/data/contentData";
import { getUserContentData } from "../content/data/getContentData";

export default async function calculateAccountEarnings(
    userID: string,
){

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
    const earnings = (totalClicks  * (25/1000)) + (totalViews  * (1/1000));

    return earnings;
}

export async function calculateAccountPaidout(
    userID: string,
    type: string,
){
    let payments = (await PaymentsDB.find({
        userID: userID,
        status: "complete",
        type: type,
    }).select("amount"));

    let total = 0;

    for (var payment of payments) {
        total += payment.amount;
    }
    
    return total;

}