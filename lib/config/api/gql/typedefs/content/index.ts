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
      apiKey: String
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

  type Content {
    id: ID
    theme: String
    title: String
    link: String
    uploadDate: String
    tags: [CTag]
    owner: ContentOwner
  }
  
  type CTag {
    tag: String!
  }

  type Tag {
    tag: String!
  }

  type ContentOwner {
    uid: String!
    displayName: String!
  }

  type ContentWithData {
    content: Content!
    data: [ContentData]!
  }

  type ContentData {
    contentID: String!
    clicks: Int!
    views: Int!
    skips: Int!
  }

  input ContentInput {
    theme: String!
    title: String!
    link: String!
    uploadDate: String!
    tags: [TagInput]!
    owner: ContentOwnerInput!
  }

  input ContentOwnerInput {
    uid: String!
    displayName: String!
  }

  input LimitedContentInput {
    title: String!
    link: String!
    tags: [LMITag]!
  }

  input LMITag{
    tag: String!
  }

  input TagInput {
    tag: String!
  }
`;
