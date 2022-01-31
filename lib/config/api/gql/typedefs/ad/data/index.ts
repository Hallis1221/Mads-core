import { gql } from "apollo-server-micro";

export const adDataTypeDefs = gql`
  scalar Date

  type Query {
    getAdDataQuery(adID: String!, apiKey: String): AdData!
  }

  type Mutation {
    createAdDataMutation(adData: AdDataInput!, apiKey: String): AdData!

    updateAdDataMutation(
      adDataID: String!
      apiKey: String!
      adData: AdDataInput!
    ): AdData!
  }

  type AdData {
    adID: String!
    clicks: Int!
    views: Int!
    skips: Int!
    matches: [Match]!
  }

  type Match {
    contentID: String!
    begins: Date!
    ends: Date!
  }

  input AdDataInput {
    adID: String!
    clicks: Int!
    views: Int!
    skips: Int!
    matches: [MatchInput]!
  }

  input MatchInput {
    contentID: String!
    begins: Date!
    ends: Date!
  }
`;
