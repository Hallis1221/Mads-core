import { gql } from "apollo-server-micro";

export const contentTypeDefs = gql`
  type Query {
    getContentQuery(id: String!): Content!
    getContentsQuery(apiKey: String!): [Content]!
    getUserContentQuery(apiKey: String, userID: String!): [Content]!
  }

  type Mutation {
    createContentMutation(
      content: LimitedContentInput!
      apiKey: String!
    ): ContentWithData!

    adminCreateContentMutation(
      content: ContentInput!
      apiKey: String!
    ): Content!

    updateContentMutation(
      contentID: String!
      apiKey: String!
      content: LimitedContentInput!
    ): Content!
  }

  input ContentInput {
    theme: String!
    title: String!
    link: String!
    uploadDate: String!
    owner: ContentOwnerInput!
    tags: [CTagInput]!
    password: String!
  }

  input LimitedContentInput {
    title: String!
    link: String!
    tags: [String]!
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

  type ContentData {
    contentID: String!
    clicks: Int!
    views: Int!
    skips: Int!
  }

  type ContentWithData {
    content: Content!
    data: ContentData!
  }
`;
