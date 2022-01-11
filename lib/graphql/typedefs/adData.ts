import { gql } from "apollo-server-micro";

// See lib/models for the schema

export const adDataTypeDefs = gql`
type Query {
    getAdsData(password: PasswordInput): [AdData]!
    getAdData(adID: String!): AdData!
  }

  type Mutation {
    createAdData(input: AdDataCreateInput): AdData
    updateAdData(adID: String!, input: AdDataInput): AdData
    deleteAdData(adID: String!, input: PasswordInput): AdData
  }

  type AdData {
    adID: String!
    clicks: Int!
    skips: Int!
    views: Int!
  }

  input PasswordInput {
    password: String
  }
  
  input AdDataCreateInput {
    adID: String!
    clicks: Int!
    skips: Int!
    views: Int!
    password: String
  }
  input AdDataInput {
    clicks: Int
    skips: Int
    views: Int
    password: String
  }
`;
