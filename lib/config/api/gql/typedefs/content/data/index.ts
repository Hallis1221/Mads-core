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
      contentData: ContentDataInput!
      apiKey: String
    ): ContentData!
    updateContentDataMutation(
      contentDataID: String!
      apiKey: String!
      contentData: ContentDataInput!
    ): ContentData!
  }

  type ContentData {
    contentID: String!
    clicks: Int!
    views: Int!
    skips: Int!
  }

  input ContentDataInput {
    contentID: String!
    clicks: Int!
    views: Int!
    skips: Int!
  }
`;
