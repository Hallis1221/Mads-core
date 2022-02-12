import { gql } from "apollo-server-micro";

export const dataTypeDefs = gql`
  type Query {
    isCreatorQuery(email: String): Boolean!
    getUserStripeIDQuery(apiKey: String): String!
    getUserStripeOnboardingLinkQuery(apiKey: String): String!
  }

  type Mutation {
    registerViewsMutation(adID: ID!, contentID: ID!): Boolean
    registerClicksMutation(adID: ID!, contentID: ID!): Boolean
    registerSkipsMutation(adID: ID!, contentID: ID!): Boolean
    createCreatorKeyMutation: String!
    defaultUserMutation(userID: String!): User!
    createUserStripeIDMutation(apiKey: String!): String!
  }

  type User {
    email: String!
    id: String!
    name: String!
  }
`;
