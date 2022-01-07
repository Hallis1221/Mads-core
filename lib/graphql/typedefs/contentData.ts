import { gql } from "apollo-server-micro";

// See lib/models for the schema

export const contentDataTypeDefs = gql`
  type Query {
    getContentData(contentID: String!): ContentData!
  }

  type Mutation {
    createContentData(input: ContentDataCreateInput): ContentData
    updateContentData(contentID: String!, input: ContentDataInput): ContentData
    deleteContentData(contentID: String!, input: PasswordInput): ContentData
  }

  type ContentData {
    contentID: String!
    clicks: Int!
    views: Int!
    skips: Int!
    uploadDate: String!
  }

  input ContentDataCreateInput {
    contentID: String!
    clicks: Int!
    skips: Int!
    views: Int!
    uploadDate: String!
    password: String
  }

  input PasswordInput {
    password: String
  }

  input ContentDataInput {
    clicks: Int
    skips: Int
    views: Int
    password: String
  }
`;
