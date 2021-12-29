import { gql } from "apollo-server-micro";

export const typeDefs = gql`
  type Query {
    getAds: [Ad]!
    getAd(id: ID!): Ad
  }

  type Mutation {
    createAd(input: AdInput): Ad
    updateAd(id: ID!, input: AdInput): Ad
    deleteAd(id: ID!): Ad
  }

  type Ad {
    id: ID!
    type: String!
    theme: String!
    title: String!
    link: String!
    image: String
    tags: [Tag]!
    owner: AdOwner!
  }

  input AdInput {
    type: String!
    theme: String!
    title: String!
    link: String!
    image: String
    tags: [TagInput]
  }

  type AdOwner {
    uid: String!
    displayName: String!
  }

  input TagInput {
    tag: String!
    priority: Int!
  }

  type Tag {
    tag: String!
    priority: Int!
  }
`;
