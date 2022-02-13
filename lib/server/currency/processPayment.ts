import PaymentsDB from "../../db/currency/payments";
import ConfigDB from "../../db/models/config";

export async function quePayment(userID: string, amount: number, type: string) {
  // Check if the user already has a payment pending
  let exsitingPayment = await PaymentsDB.findOne({
    userID,
    status: "pending",
    type: type,
  });

  if (exsitingPayment)
    throw new Error(
      `User with id: ${userID} already has a pending ${type}. Contact support if you wish to delete the pending ${type}`
    );

  // Get old payments that are complete
  let oldPayments = await PaymentsDB.find({
    userID,
    status: "complete",
    type: type,
  });

  // Calculate the total amount of old payments
  let totalAmount = oldPayments.reduce((acc, payment) => {
    return acc + payment.amount;
  }, 0);

  // Subtract the old payments (that have already been paid) from the amount
  amount = amount - totalAmount;

  // If the amount is less than 0, throw an error
  if (amount < 0)
    throw new Error(
      `User with id: ${userID} has a negative balance. Contact support`
    );

  // If the amount is 0, throw an error
  if (amount === 0)
    throw new Error(
      `User with id: ${userID} have not increased their balance since the last payout. Contact support if you believe this is an error`
    );

  // Ensure the amount is bigger than the minimum payout
  
  let minimumPayout =  (await ConfigDB.findOne({name: "prototyping"}).select("minimumPayout"))?.minimumPayout
  if (amount <= minimumPayout)
    throw new Error(
      `User with id: ${userID} has a balance of ${minimumPayout}. The minimum payout is $25. Contact support if you believe this is an error`
    );
    
  // Add the payment to the paymentsDB collection
  const payment = await PaymentsDB.create({
    userID: userID,
    amount: amount,
    status: "pending",
    type: type,
    createdAt: new Date(),
  });

  // Return the payment
  return payment;
}
