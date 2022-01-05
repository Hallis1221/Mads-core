// Type definitions for a content model. Loosly based on the ad model/schema.

import { gql } from "apollo-server-micro";

// See lib/models for the schema

export const contentTypeDefs = gql`
  type Query {
    getContent(id: ID!): Content
    getContents(input: PasswordInput): [Content]!
  }

  type Mutation {
    createContent(input: ContentInput): Content
    updateContent(id: ID!, input: ContentInput): Content
    deleteContent(id: ID!, input: PasswordInput): Content
  }

  type Content {
    id: ID!
    theme: String!
    title: String!
    link: String!
    tags: [CTag]!
    owner: ContentOwner!
  }

  input ContentInput {
    theme: String!
    title: String!
    link: String!
    owner: ContentOwnerInput!
    tags: [CTagInput]!
    password: String
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

  input PasswordInput {
    password: String
  }

  type CTag {
    tag: String!
  }
`;
