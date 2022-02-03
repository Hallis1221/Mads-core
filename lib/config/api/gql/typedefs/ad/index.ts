import { gql } from "apollo-server-micro";
import { DocumentNode } from "graphql";

export const adTypeDefs: DocumentNode = gql`
  type Query {
    getAdQuery(adID: String!, apiKey: String): Ad!
  }

  type Mutation {
    createAdMutation(ad: AdInput!, apiKey: String): Ad!
    updateAdMutation(adID: String!, apiKey: String, ad: AdInput!): Ad!
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

  type AdOwner {
    uid: String!
    displayName: String!
  }

  type Tag {
    tag: String!
    priority: Int!
  }

  input AdInput {
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
    tags: [TagInput]!
  }

  input TagInput {
    tag: String!
    priority: Int!
  }

`;
