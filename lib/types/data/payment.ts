export type Payment = {
  amount: number;
  status: string;
  type: string;
  date: Date;
  stripeID: string;
  email: string;
  userID: string;
  totalViews: number;
  totalClicks: number;
};
