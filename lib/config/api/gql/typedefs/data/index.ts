import { gql } from "apollo-server-micro";

export const dataTypeDefs = gql`
  scalar Date

  type Query {
    isCreatorQuery(email: String): Boolean!
    getUserStripeIDQuery(apiKey: String): String!
    getUserStripeOnboardingLinkQuery(apiKey: String): String!
    calculateCreatorLifetimeEarningsQuery(apiKey: String, estimate: Boolean!): Float!
    getPaymentHistoryQuery(apiKey: String): [Payment!]!
    getAvalibleCreatorPayoutAmountQuery(apiKey: String): Mins!
  }

  type Mutation {
    registerViewsMutation(adID: ID!, contentID: ID!): Boolean
    registerClicksMutation(adID: ID!, contentID: ID!): Boolean
    registerSkipsMutation(adID: ID!, contentID: ID!): Boolean
    createCreatorKeyMutation: String!
    defaultUserMutation(userID: String!): User!
    createUserStripeIDMutation(apiKey: String!): String!
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
