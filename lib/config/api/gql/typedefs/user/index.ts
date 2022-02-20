import { gql } from "apollo-server-micro";

export const userTypeDefs = gql`
  scalar Date

  type Query {
    getUserStripeIDQuery(apiKey: String): String!
    getUserStripeOnboardingLinkQuery(apiKey: String): String!
    getPaymentHistoryQuery(apiKey: String): [Payment!]!
    getAllUsersQuery(apiKey: String): [User!]!
  }

  type Mutation {
    defaultUserMutation(userID: String!): User!
    createUserStripeIDMutation(apiKey: String!): String!
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
    _id: String!
    email: String!
    creator: Boolean
    admin: Boolean
  }
`;
