import { gql } from "apollo-server-micro";

// See lib/models for the schema

export const contentDataTypeDefs = gql`
  type Query {
    getContentDataQuery(contentID: String!, apiKey: String): ContentData!
    getUserContentDataQuery(userID: String!, apiKey: String): [ContentData]!
    getContentDataMonthQuery(contentID: String!, apiKey: String): ContentData!
    getLastContentDataQuery(contentID: String!, apiKey: String): ContentData!
  }

  type Mutation {
    createContentDataMutation(
      contentData: ContentData!
      apiKey: String
    ): ContentData!
    updateContentDataMutation(
      contentDataID: String!
      apiKey: String!
      contentData: ContentData!
    ): ContentData!
  }

  type ContentData {
    contentID: String!
    clicks: Int!
    views: Int!
    skips: Int!
  }
`;
