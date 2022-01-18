import { gql } from "apollo-server-micro";

export const dataTypeDefs = gql`
  scalar Date

  type Mutation {
    registerViews(adID: ID!, contentID: ID!): Boolean
    registerClicks(adID: ID!, contentID: ID!): Boolean
    registerSkips(adID: ID!, contentID: ID!): Boolean
  }

  type Query {
    getUserContent(userID: ID, password: String!): [Content!]
    getUserContentPerformances(userID: ID, password: String): [ContentData!]
    getContentMonthHistory(contentID: ID, password: String): [HistoryData!]
    getComperableContentHistory(contentID: ID, password: String): [HistoryData!]
  }
  
  type ContentData {
    contentID: String!
    clicks: Int!
    views: Int!
    skips: Int!
  }

  type HistoryContentD {
    contentID: String!
    clicks: Int
    views: Int
    skips: Int
  }

  type HistoryData {
    t: Date!
    contentID: String!
    d: HistoryContentD!
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
