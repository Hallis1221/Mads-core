import { gql } from "apollo-server-micro";

export const contentDataTypeDefs = gql`
type Query {
    getContentData(contentID: String!): ContentData!
  }

  type Mutation {
    createContentData(input: ContentDataCreateInput): ContentData
    updateContentData(contentID: String!, input: ContentDataInput): ContentData
    deleteContentData(contentID: String!): ContentData
  }

  type ContentData {
    contentID: String!
    clicks: Int!
    views: Int!
    uploadDate: String!
  }
  
  input ContentDataCreateInput {
    contentID: String!
    clicks: Int!
    views: Int!
    uploadDate: String!
  }
  
  input ContentDataInput {
    clicks: Int
    views: Int
  }
`;
