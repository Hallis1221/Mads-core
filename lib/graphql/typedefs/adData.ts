import { gql } from "apollo-server-micro";

// See lib/models for the schema

export const adDataTypeDefs = gql`
  scalar Date

  type Query {
    getAdsData(password: PasswordInput): [AdData]!
    getAdData(adID: String!): AdData!
  }

  type Mutation {
    createAdData(input: AdDataCreateInput): AdData
    updateAdData(adID: String!, input: AdDataInput): AdData
    deleteAdData(adID: String!, input: PasswordInput): AdData
    addAdDataMatch(adID: String!, input: AddAdDataMatchInput): AdData
  }

  type AdData {
    adID: String!
    clicks: Int!
    skips: Int!
    views: Int!
    matches: [Match]!
  }

  type Match {
    contentID: String!
    begins: Date!
    ends: Date!
  }

  input AddAdDataMatchInput {
    contentID: String!
    begins: Date!
    ends: Date!
    password: String!
  }

  input MatchInput {
    contentID: String!
    begins: Date!
    ends: Date!
  }

  input PasswordInput {
    password: String
  }

  input AdDataCreateInput {
    adID: String!
    clicks: Int!
    skips: Int!
    views: Int!
    matches: [MatchInput]!
    password: String
  }

  input AdDataInput {
    clicks: Int
    skips: Int
    views: Int
    matches: [MatchInput]
    password: String
  }
`;
