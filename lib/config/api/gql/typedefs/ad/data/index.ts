import { gql } from "apollo-server-micro";

export const adDataTypeDefs = gql`
  type Query {
    getAdDataQuery(adID: String!, apiKey: String): AdData!
  }

  type Mutation {
    createAdDataMutation(adData: AdData!, apiKey: String): AdData!

    updateAdDataMutation(
      adDataID: String!
      apiKey: String!
      adData: AdData!
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
`;
