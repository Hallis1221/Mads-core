import { gql } from "apollo-server-micro";

export const dataTypeDefs = gql`
  scalar Date

  type Mutation {
    registerViewsMutation(adID: ID!, contentID: ID!): Boolean
    registerClicksMutation(adID: ID!, contentID: ID!): Boolean
    registerSkipsMutation(adID: ID!, contentID: ID!): Boolean
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
