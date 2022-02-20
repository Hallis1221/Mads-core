import { gql } from "apollo-server-micro";

export const creatorTypeDefs = gql`
  scalar Date

  type Query {
    isCreatorQuery(email: String): Boolean!
    calculateCreatorLifetimeEarningsQuery(apiKey: String, estimate: Boolean!): Float!
    getPaymentHistoryQuery(apiKey: String): [Payment!]!
    getAvalibleCreatorPayoutAmountQuery(apiKey: String): Mins!
  }

  type Mutation {
    createCreatorKeyMutation: String!
    createNewCreatorPaymentMutation(apiKey: String): Payment
  }

  type Payment {
    amount: Float!
    status: String!
    type: String!
    createdAt: Date!
  }

  type Mins {
    minimumPayout: Float!
    balance: Float!
  }

  type User {
    email: String!
    id: String!
    name: String!
  }
`;
