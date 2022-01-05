import { gql } from "apollo-server-micro";

// See lib/models for the schema

export const adTypeDefs = gql`
  type Query {
    getAds(input: PasswordInput): [Ad]!
    getAd(id: ID!): Ad
    findAd(input: FindAdInput): Ad!
  }

  type Mutation {
    createAd(input: AdInput): Ad
    updateAd(id: ID!, input: AdInput): Ad
    deleteAd(id: ID!, input: PasswordInput): Ad
  }

  type Ad {
    id: ID!
    type: String!
    theme: String!
    title: String!
    link: String!
    image: String
    video: String
    tags: [Tag]!
    owner: AdOwner!
  }

  input AdInput {
    type: String!
    theme: String!
    title: String!
    link: String!
    image: String
    video: String
    owner: AdOwnerInput!
    password: String
    tags: [TagInput]!
  }

  type AdOwner {
    uid: String!
    displayName: String!
  }

  input AdOwnerInput {
    uid: String!
    displayName: String!
  }
  
  input PasswordInput {
    password: String
  }

  input TagInput {
    tag: String!
    priority: Int!
  }

  type Tag {
    tag: String!
    priority: Int!
  }

  input FindAdInput {
    theme: String!
    tags: [String]!
  }

`;
