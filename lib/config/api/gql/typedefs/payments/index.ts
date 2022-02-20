import { gql } from "apollo-server-micro";

export const paymentTypeDefs = gql`
  scalar Date

  type Query {
    getPendingPaymentsQuery(apiKey: String): [Payment!]!
  }

  type Payment {
    amount: Float!
    status: String!
    type: String!
    date: Date!
    stripeID: String!
    email: String!
    userID: String!
    totalViews: Int!
    totalClicks: Int!
  }
`;
