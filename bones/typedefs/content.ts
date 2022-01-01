// Type definitions for a content model. Loosly based on the ad model/schema.

import { gql } from "apollo-server-micro";

export const contentTypeDefs = gql`
  type Query {
    getContent(id: ID!): Content
  }

  type Mutation {
    createContent(input: ContentInput): Content
    updateContent(id: ID!, input: ContentInput): Content
    deleteContent(id: ID!): Content
  }

  type Content {
    id: ID!
    theme: String!
    title: String!
    link: String!
    tags: [Tag]!
    owner: ContentOwner!
  }

  input ContentInput {
    theme: String!
    title: String!
    link: String!
    owner: ContentOwnerInput!
    tags: [CTagInput]!
  }

  type ContentOwner {
    uid: String!
    displayName: String!
  }

  input ContentOwnerInput {
    uid: String!
    displayName: String!
  }

  input CTagInput {
    tag: String!
  }

  type Tag {
    tag: String!
  }
`;
