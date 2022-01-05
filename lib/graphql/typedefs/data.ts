import { gql } from "apollo-server-micro";

// See lib/models for the schema

export const dataTypeDefs = gql`
  type Mutation {
    registerViews(adID: ID!, contentID: ID!): Boolean
    registerClicks(adID: ID!, contentID: ID!): Boolean
  }
`;
