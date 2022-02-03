import { gql } from "apollo-server-micro";

export const dataTypeDefs = gql`
  type Query {
    isCreatorQuery(email: String): Boolean!
  }

  type Mutation {
    registerViewsMutation(adID: ID!, contentID: ID!): Boolean
    registerClicksMutation(adID: ID!, contentID: ID!): Boolean
    registerSkipsMutation(adID: ID!, contentID: ID!): Boolean
    defaultUserMutation(userID: String!): User!
  }

  type User {
    email: String!
    id: String!
    name: String!
  }
`;
