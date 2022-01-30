import { gql } from "apollo-server-micro";
import { DocumentNode } from "graphql";

export const adTypeDefs: DocumentNode = gql`
  type Query {
    getAdQuery(adID: String!, apiKey: String): Ad!
  }

  type Mutation {
    createAdMutation(ad: Ad!, apiKey: String): Ad!
    updateAdMutation(adID: String!, apiKey: String, ad: Ad!): Ad!
  }

  type Ad {
    id: ID!
    type: String!
    theme: String!
    title: String!
    link: String!
    image: String
    video: String
    maxClicks: Int!
    maxViews: Int!
    startDate: String!
    endDate: String!
    tags: [Tag]!
    owner: AdOwner!
  }
`;
