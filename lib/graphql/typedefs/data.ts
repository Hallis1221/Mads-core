import { gql } from "apollo-server-micro";

export const dataTypeDefs = gql`
  type Mutation {
    registerViews(adID: ID!, contentID: ID!): Boolean
    registerClicks(adID: ID!, contentID: ID!): Boolean
    registerSkips(adID: ID!, contentID: ID!): Boolean
  }

  type Query {
    getUserContent(userID: ID!, password: String!): [Content!]
    getUserContentPerformances(userID: ID!, password: String): [ContentData!]
  }
  
  type ContentData {
    contentID: String!
    clicks: Int!
    views: Int!
    skips: Int!
  }

  type Content {
    id: ID!
    theme: String!
    title: String!
    link: String!
    uploadDate: String!
    tags: [CTag]!
    owner: ContentOwner!
  }
`;
