import { gql } from "graphql-request";

export const dataTypeDefs = gql`
  type Mutation {
    registerViews(adID: ID!, contentID: ID!): Boolean
  }
`;
