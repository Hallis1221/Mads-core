import { isAuthorized } from "../../../../../auth/checks";
import PaymentsDB from "../../../../../db/currency/payments";
import UserDB from "../../../../../db/models/auth/user";
import ContentDataDB from "../../../../../db/models/content/data";
import { Payment } from "../../../../../types/data/payment";
import { User } from "../../../../../types/user";

// This is the resolver for the getPendingPayments query.
export async function getPendingPaymentsQuery(
  _: any,
  { apiKey }: { apiKey: string },
  { user }: { user: User }
) {
  // Check if the apiKey is valid.
  if (apiKey) {
    if (
      !(await isAuthorized("admin", apiKey, {
        contentid: undefined,
      }))
    )
      throw new Error("Invalid API key.");

    let rawPayments = await PaymentsDB.find({
      status: "pending",
    });

    let payments: Payment[] = [];

    for (let rawPayment of rawPayments) {
      let user = await UserDB.findById(rawPayment.userID);
      let totalViews = 0;
      let totalClicks = 0;

      await ContentDataDB.find({
        userID: rawPayment.userID,
      }).then((data) => {
        for (let contentData of data) {
          totalViews += contentData.views;
          totalClicks += contentData.clicks;
        }
      });

      let newPayment: Payment = {
        amount: rawPayment.amount,
        status: rawPayment.status,
        type: rawPayment.type,
        date: rawPayment.createdAt,
        stripeID: user.stripeID,
        email: user.email,
        userID: rawPayment.userID,
        totalViews,
        totalClicks,
      };

      payments.push(newPayment);
    }

    return payments;
  }

  // Check if the user is authorized.
  if (user && user.user) {
    if (
      !(await isAuthorized("admin", user.user, {
        contentid: undefined,
      }))
    )
      throw new Error("Invalid user.");

    let rawPayments = await PaymentsDB.find({
      status: "pending",
    });

    let payments: Payment[] = [];

    for (let rawPayment of rawPayments) {
      let user = await UserDB.findById(rawPayment.userID);
      let totalViews = 0;
      let totalClicks = 0;

      await ContentDataDB.find({
        userID: rawPayment.userID,
      }).then((data) => {
        for (let contentData of data) {
          totalViews += contentData.views;
          totalClicks += contentData.clicks;
        }
      });
      let newPayment: Payment = {
        amount: rawPayment.amount,
        status: rawPayment.status,
        type: rawPayment.type,
        date: rawPayment.createdAt,
        stripeID: user.stripeID,
        email: user.email,
        userID: rawPayment.userID,
        totalViews,
        totalClicks,
      };

      payments.push(newPayment);
    }

    return payments;
  }

  throw new Error("Invalid user.");
}
