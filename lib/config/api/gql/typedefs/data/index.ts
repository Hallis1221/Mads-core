import { gql } from "apollo-server-micro";

export const dataTypeDefs = gql`
  type Mutation {
    registerViews(adID: ID!, contentID: ID!): Boolean
    registerClicks(adID: ID!, contentID: ID!): Boolean
    registerSkips(adID: ID!, contentID: ID!): Boolean
    defaultUserMutation(userID: String!): User!
  }

  type User {
    email: String!
    id: String!
    name: String!
  }
`;
